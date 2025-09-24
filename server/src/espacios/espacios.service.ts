import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Espacio, Prisma } from '../../generated/prisma';

@Injectable()
export class EspaciosService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    espacioWhereUniqueInput: Prisma.EspacioWhereUniqueInput,
  ): Promise<Espacio | null> {
    return this.prisma.espacio.findUnique({
      where: espacioWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EspacioWhereUniqueInput;
    where?: Prisma.EspacioWhereInput;
    orderBy?: Prisma.EspacioOrderByWithRelationInput;
  }): Promise<Espacio[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.espacio.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.EspacioCreateInput): Promise<Espacio> {
    return this.prisma.espacio.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.EspacioWhereUniqueInput;
    data: Prisma.EspacioUpdateInput;
  }): Promise<Espacio> {
    const { where, data } = params;
    return this.prisma.espacio.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.EspacioWhereUniqueInput): Promise<Espacio> {
    return this.prisma.espacio.delete({
      where,
    });
  }
}
