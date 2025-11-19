import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, Matches, Min } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        description: 'ID do usuário a ser atualizado',
        example: 1,
        required: true,
    })
    @IsNotEmpty({ message: 'O ID é obrigatório' })
    @IsInt({ message: 'O ID deve ser um número inteiro' })
    @Min(1, { message: 'O ID deve ser maior que zero' })
    id!: number;

    @ApiProperty({
        description: 'Novo email do usuário',
        example: 'novoemail@example.com',
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsEmail({}, { message: 'O email deve ser um endereço de email válido' })
    @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
    email?: string;

    @ApiProperty({
        description: 'Novo nome de usuário',
        example: 'novousuario',
        required: false,
        minLength: 3,
        maxLength: 50,
    })
    @IsOptional()
    @IsString({ message: 'O nome de usuário deve ser uma string' })
    @MinLength(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
    @MaxLength(50, { message: 'O nome de usuário deve ter no máximo 50 caracteres' })
    @Matches(/^[a-zA-Z0-9_]+$/, { 
        message: 'O nome de usuário deve conter apenas letras, números e underscore' 
    })
    username?: string;

    @ApiProperty({
        description: 'Nova senha do usuário',
        example: 'novaSenhaSegura123',
        required: false,
        minLength: 6,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: 'A senha deve ser uma string' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    @MaxLength(100, { message: 'A senha deve ter no máximo 100 caracteres' })
    password?: string;
}

