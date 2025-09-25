import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from '../prisma.service';
import { AuthSuccessResponse } from './entities/auth.entity';
import { handlePrismaError } from '../shared/utils/errors.util';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(loginAuthDto: LoginAuthDto): Promise<AuthSuccessResponse> {
    // find user in db
    const found = await this.prisma.client.findUnique({
      where: { email: loginAuthDto.email },
    });

    if (!found) throw new NotFoundException('User not found');

    return { id: found.id, apiKey: process.env.API_KEY as string };
  }

  async register(
    registerAuthDto: RegisterAuthDto,
  ): Promise<AuthSuccessResponse | void> {
    try {
      // find user in db
      const found = await this.prisma.client.findUnique({
        where: { email: registerAuthDto.email },
      });

      if (found) return await this.login(registerAuthDto);

      // create user
      const created = await this.prisma.client.create({
        data: {
          email: registerAuthDto.email,
        },
      });

      return { id: created.id, apiKey: process.env.API_KEY as string };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
