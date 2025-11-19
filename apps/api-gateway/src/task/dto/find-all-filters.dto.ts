import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';
import { TaskPriority, TaskStatus } from '@repo/types';

export class FindAllFilters {
    @ApiProperty({
        description: 'Filtrar tarefas por título (busca parcial)',
        example: 'autenticação',
        required: false,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: 'O título deve ser uma string' })
    @MaxLength(100, { message: 'O título de busca deve ter no máximo 100 caracteres' })
    title?: string;

    @ApiProperty({
        description: 'Filtrar tarefas por status',
        example: TaskStatus.IN_PROGRESS,
        enum: TaskStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(TaskStatus, { message: 'O status deve ser TODO, IN_PROGRESS, REVIEW ou DONE' })
    status?: TaskStatus;

    @ApiProperty({
        description: 'Filtrar tarefas por prioridade',
        example: TaskPriority.HIGH,
        enum: TaskPriority,
        required: false,
    })
    @IsOptional()
    @IsEnum(TaskPriority, { message: 'A prioridade deve ser LOW, MEDIUM, HIGH ou URGENT' })
    priority?: TaskPriority;

    @ApiProperty({
        description: 'Filtrar tarefas por ID do usuário',
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsInt({ message: 'O ID do usuário deve ser um número inteiro' })
    @Min(1, { message: 'O ID do usuário deve ser maior que zero' })
    userId?: number;
}

