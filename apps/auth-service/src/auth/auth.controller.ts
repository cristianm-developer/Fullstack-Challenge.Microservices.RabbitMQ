import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto, AUTH_PATTERNS } from '@repo/types';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(AUTH_PATTERNS.LOGIN_USER)
    async login(@Payload() payload: LoginUserDto) {
    }

}
