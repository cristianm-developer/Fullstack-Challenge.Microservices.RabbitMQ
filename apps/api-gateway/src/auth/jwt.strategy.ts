import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayload } from '@repo/types';

@Injectable()
export class JwtStrategy {
  constructor(private readonly jwtService: JwtService) {}

  async validate(token: string): Promise<JwtPayload> {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      
      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Token validation failed');
    }
  }
}

