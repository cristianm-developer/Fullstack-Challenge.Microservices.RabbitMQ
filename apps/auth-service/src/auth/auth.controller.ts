import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS, LoginUserDto, RegisterUserDto, UpdateUserDto } from '@repo/types';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @MessagePattern(AUTH_PATTERNS.LOGIN_USER)
    async login(@Payload() payload: LoginUserDto) {
        return await this.authService.login(payload);
    }

    @MessagePattern(AUTH_PATTERNS.FIND_ALL_USERS)
    async findAll() {
        return await this.authService.findAll();
    }

    @MessagePattern(AUTH_PATTERNS.REGISTER_USER)
    async register(@Payload() payload: RegisterUserDto) {
        return await this.authService.register(payload);
    }

    @MessagePattern(AUTH_PATTERNS.UPDATE_USER)
    async update(@Payload() payload: UpdateUserDto) {
        return await this.authService.update(payload);
    }

}
