export class LoginUserDto {
    usernameOrEmail!: string;
    password!: string;
}

export class AuthResponse {
    accessToken!: string;
    refreshToken!: string;
    expiresIn!: string;
}

export class JwtPayload {
    sub!: number;
}

export class RefreshTokenDto {  
    refreshToken!: string;
}

export class RegisterUserDto {
    email!: string;
    username!: string;
    password!: string;
}

export class ResetPasswordDto {
    id!: number;
    password!: string;
}

export class UpdateUserDto {
    id!: number;
    email?: string;
    username?: string;
    password?: string;
}