import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Reserva, Prisma } from '../../generated/prisma';

interface ReservaCreateInput extends Prisma.ReservaCreateInput {
  espacioId: string;
  clientId: string;
}

type ReservaCreateWithoutEspacioInput = Omit<
  ReservaCreateInput,
  'espacio' | 'client'
>; // Omit the espacio field (ts trick)

interface ReservaUpdateInput extends Prisma.ReservaUpdateInput {
  espacioId?: string;
}

@Injectable()
export class ReservasService {
  private MAX_RESERVATIONS = 3;
  constructor(private prisma: PrismaService) {}

  async findOne(
    reservaWhereUniqueInput: Prisma.ReservaWhereUniqueInput,
  ): Promise<Reserva | null> {
    return this.prisma.reserva.findUnique({
      where: reservaWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReservaWhereUniqueInput;
    where?: Prisma.ReservaWhereInput;
    orderBy?: Prisma.ReservaOrderByWithRelationInput;
  }): Promise<Reserva[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.reserva.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: ReservaCreateInput): Promise<Reserva> {
    // check if user has a max of reservations per week
    const reservationDate = new Date(data.reservationDate);
    const { startOfWeek, endOfWeek } = this.getWeekRange(reservationDate);

    const userReservationsThisWeek = await this.prisma.reserva.findMany({
      where: {
        clientId: data.clientId,
        reservationDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    if (userReservationsThisWeek.length >= this.MAX_RESERVATIONS) {
      throw new BadRequestException(
        `User has reached the maximum number of reservations (${this.MAX_RESERVATIONS}) per week`,
      );
    }
    // Convert string to date
    data.reservationDate = new Date(data.reservationDate);

    // First, check if the time slot is available
    const { isAvailable, message } = await this.canCreateReservation(
      null,
      data.espacioId,
      data.reservationDate,
      data.startTime,
      data.endTime,
    );

    if (!isAvailable) {
      throw new BadRequestException(message);
    }

    // If available, create the reservation
    return this.prisma.reserva.create({
      data: data as ReservaCreateWithoutEspacioInput,
    });
  }

  async update(params: {
    where: Prisma.ReservaWhereUniqueInput;
    data: ReservaUpdateInput;
  }): Promise<Reserva> {
    const { where, data } = params;

    // Check if user is trying to update time-related fields
    const isUpdatingTimeFields =
      data.startTime || data.endTime || data.reservationDate;

    if (isUpdatingTimeFields) {
      // If updating any time field, we need ALL time fields to be provided for validation
      if (!data.reservationDate || !data.startTime || !data.endTime) {
        throw new BadRequestException(
          'reservationDate, startTime, and endTime are all required when updating any time-related field',
        );
      }

      // First find related espacio
      const reserva = await this.prisma.reserva.findUnique({
        where: { id: where.id },
      });

      if (!reserva) {
        throw new Error('reserva not found');
      }

      const espacioId = reserva.espacioId;

      // Second, check if the time slot is available (excluding the current reservation)
      const { isAvailable, message } = await this.canCreateReservation(
        reserva.id,
        espacioId,
        data.reservationDate as Date,
        data.startTime as string,
        data.endTime as string,
      );

      if (!isAvailable) {
        throw new BadRequestException(message);
      }
    }

    return this.prisma.reserva.update({
      data: data as ReservaCreateWithoutEspacioInput,
      where,
    });
  }

  async remove(where: Prisma.ReservaWhereUniqueInput): Promise<Reserva> {
    return this.prisma.reserva.delete({
      where,
    });
  }

  private getWeekRange(date: Date): { startOfWeek: Date; endOfWeek: Date } {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const startOfWeek = new Date(d.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { startOfWeek, endOfWeek };
  }

  private async checkExistingReservation(
    espacioId: string,
    reservationDate: Date,
    startTime: string,
    endTime: string,
  ) {
    try {
      // Find existing reservations for the same espacio on the same date
      // that overlap with the requested time slot
      const existingReservations = await this.prisma.reserva.findMany({
        where: {
          espacioId: espacioId,
          reservationDate: reservationDate,
          OR: [
            {
              // CASE 1: New reservation STARTS during an existing reservation
              startTime: { lte: startTime }, // Existing starts BEFORE or at new start time
              endTime: { gt: startTime }, // Existing ends AFTER new start time (so it's still active when new one starts)
            },
            {
              // CASE 2: New reservation ENDS during an existing reservation
              startTime: { lt: endTime },
              endTime: { gte: endTime },
            },
            {
              // CASE 3: New reservation COMPLETELY CONTAINS an existing reservation
              startTime: { gte: startTime }, // Existing starts AFTER or at new start time
              endTime: { lte: endTime }, // Existing ends BEFORE or at new end time (existing is inside new)
            },
            {
              // CASE 4: Existing reservation COMPLETELY CONTAINS the new reservation
              startTime: { lte: startTime }, // Existing starts BEFORE or at new start time
              endTime: { gte: endTime }, // Existing ends AFTER or at new end time (new is inside existing)
            },
          ],
        },
      });

      return existingReservations;
    } catch (error) {
      console.error('Error checking existing reservations:', error);
      throw error;
    }
  }

  /**
   * Private method to check if a reservation can be created for the given space at the given time slot.
   */
  private async canCreateReservation(
    reservationId: string | null,
    espacioId: string,
    reservationDate: Date,
    startTime: string,
    endTime: string,
  ): Promise<{ isAvailable: boolean; message: string }> {
    const existing = await this.checkExistingReservation(
      espacioId,
      reservationDate,
      startTime,
      endTime,
    );

    let message = '';

    if (existing.length > 0) {
      const isTheSameReservation = existing.filter(
        (reservation) => reservation.id === reservationId,
      )[0];

      if (isTheSameReservation) {
        return { isAvailable: true, message };
      }

      console.debug('⚠️ Reservation conflict found. Existing reservations:');

      message = existing
        .map(
          (reservation) =>
            `ID: ${reservation.id} has a reservation from ${reservation.startTime} to ${reservation.endTime}`,
        )
        .join('\n');

      console.debug(message);

      return { isAvailable: false, message };
    }

    return { isAvailable: true, message };
  }
}
