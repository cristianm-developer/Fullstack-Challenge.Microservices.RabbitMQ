import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, ArrayMinSize } from 'class-validator';
import { TaskPriority, TaskStatus } from '@repo/types';

export class UpdateTaskDto {
    @ApiProperty({
        description: 'ID da tarefa a ser atualizada',
        example: 1,
        required: true,
    })
    @IsNotEmpty({ message: 'O ID é obrigatório' })
    @IsInt({ message: 'O ID deve ser um número inteiro' })
    @Min(1, { message: 'O ID deve ser maior que zero' })
    id!: number;

    @ApiProperty({
        description: 'Novo título da tarefa',
        example: 'Atualizar autenticação',
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString({ message: 'O título deve ser uma string' })
    @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres' })
    title?: string;

    @ApiProperty({
        description: 'Nova descrição da tarefa',
        example: 'Atualizar sistema de autenticação com refresh token',
        required: false,
        maxLength: 2000,
    })
    @IsOptional()
    @IsString({ message: 'A descrição deve ser uma string' })
    @MaxLength(2000, { message: 'A descrição deve ter no máximo 2000 caracteres' })
    description?: string;

    @ApiProperty({
        description: 'Nova data de prazo da tarefa',
        example: '2024-12-31T23:59:59Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'O prazo deve ser uma data válida no formato ISO' })
    deadline?: Date;

    @ApiProperty({
        description: 'Nova prioridade da tarefa',
        example: TaskPriority.HIGH,
        enum: TaskPriority,
        required: false,
    })
    @IsOptional()
    @IsEnum(TaskPriority, { message: 'A prioridade deve ser LOW, MEDIUM, HIGH ou URGENT' })
    priority?: TaskPriority;

    @ApiProperty({
        description: 'Novo status da tarefa',
        example: TaskStatus.IN_PROGRESS,
        enum: TaskStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(TaskStatus, { message: 'O status deve ser TODO, IN_PROGRESS, REVIEW ou DONE' })
    status?: TaskStatus;

    @ApiProperty({
        description: 'Nova lista de IDs dos usuários atribuídos à tarefa',
        example: [1, 2, 3],
        required: false,
        type: [Number],
    })
    @IsOptional()
    @IsArray({ message: 'Os IDs dos usuários devem ser um array' })
    @ArrayMinSize(1, { message: 'Deve haver pelo menos um usuário atribuído' })
    @IsInt({ each: true, message: 'Cada ID de usuário deve ser um número inteiro' })
    @Min(1, { each: true, message: 'Cada ID de usuário deve ser maior que zero' })
    userIds?: number[];
}

