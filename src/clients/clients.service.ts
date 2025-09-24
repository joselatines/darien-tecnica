import {  Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Client, Prisma } from '../../generated/prisma';
import { handlePrismaError } from '../shared/utils/errors.util';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    clientWhereUniqueInput: Prisma.ClientWhereUniqueInput,
  ): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: clientWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ClientWhereUniqueInput;
    where?: Prisma.ClientWhereInput;
    orderBy?: Prisma.ClientOrderByWithRelationInput;
  }): Promise<Client[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.client.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.ClientCreateInput): Promise<Client | void> {
    try {
      return await this.prisma.client.create({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(params: {
    where: Prisma.ClientWhereUniqueInput;
    data: Prisma.ClientUpdateInput;
  }): Promise<Client | void> {
    try {
      const { where, data } = params;
      return await this.prisma.client.update({
        data,
        where,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(where: Prisma.ClientWhereUniqueInput): Promise<Client> {
    return this.prisma.client.delete({
      where,
    });
  }
}
