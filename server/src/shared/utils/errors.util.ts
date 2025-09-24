import { BadRequestException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma';

export function handlePrismaError(error: Error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        const targets = error.meta?.target;
        throw new BadRequestException(`${targets} already exists`);

      default:
        throw error;
    }
  } else {
    throw error;
  }
}
