import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_PATTERNS, LoginUserDto as LoginUserDtoType, RegisterUserDto as RegisterUserDtoType, UpdateUserDto as UpdateUserDtoType } from '@repo/types';
import { firstValueFrom } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('AUTH_CLIENT')
        private readonly authClient: ClientProxy,
    ) {}

    async login(loginUserDto: LoginUserDto) {
        const payload: LoginUserDtoType = {
            usernameOrEmail: loginUserDto.usernameOrEmail,
            password: loginUserDto.password,
        };
        return await firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.LOGIN_USER, payload)
        );
    }

    async register(registerUserDto: RegisterUserDto) {
        const payload: RegisterUserDtoType = {
            email: registerUserDto.email,
            username: registerUserDto.username,
            password: registerUserDto.password,
        };
        return await firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.REGISTER_USER, payload)
        );
    }

    async findAll() {
        return await firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.FIND_ALL_USERS, {})
        );
    }

    async update(updateUserDto: UpdateUserDto) {
        const payload: UpdateUserDtoType = {
            id: updateUserDto.id,
            email: updateUserDto.email,
            username: updateUserDto.username,
            password: updateUserDto.password,
        };
        return await firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.UPDATE_USER, payload)
        );
    }
}
