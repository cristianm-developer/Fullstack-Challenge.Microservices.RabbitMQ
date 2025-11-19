import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        description: 'Nome de usuário ou email do usuário',
        example: 'usuario@example.com',
        required: true,
        maxLength: 255,
    })
    @IsNotEmpty({ message: 'O nome de usuário ou email é obrigatório' })
    @IsString({ message: 'O nome de usuário ou email deve ser uma string' })
    @MaxLength(255, { message: 'O nome de usuário ou email deve ter no máximo 255 caracteres' })
    usernameOrEmail!: string;

    @ApiProperty({
        description: 'Senha do usuário',
        example: 'senhaSegura123',
        required: true,
        minLength: 6,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @IsString({ message: 'A senha deve ser uma string' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    @MaxLength(100, { message: 'A senha deve ter no máximo 100 caracteres' })
    password!: string;
}

