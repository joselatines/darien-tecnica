import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header('x-api-key'); 
    const validKey = process.env.API_KEY;

    if (apiKey !== validKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}
