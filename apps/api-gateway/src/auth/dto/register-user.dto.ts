import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({
        description: 'Email do usuário',
        example: 'usuario@example.com',
        required: true,
        maxLength: 255,
    })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    @IsEmail({}, { message: 'O email deve ser um endereço de email válido' })
    @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
    email!: string;

    @ApiProperty({
        description: 'Nome de usuário',
        example: 'usuario123',
        required: true,
        minLength: 3,
        maxLength: 50,
    })
    @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
    @IsString({ message: 'O nome de usuário deve ser uma string' })
    @MinLength(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
    @MaxLength(50, { message: 'O nome de usuário deve ter no máximo 50 caracteres' })
    @Matches(/^[a-zA-Z0-9_]+$/, { 
        message: 'O nome de usuário deve conter apenas letras, números e underscore' 
    })
    username!: string;

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

