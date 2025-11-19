import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindAllFilters } from './dto/find-all-filters.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '@repo/types';

@ApiTags('Tarefas')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    @ApiOperation({ summary: 'Criar nova tarefa', description: 'Cria uma nova tarefa no sistema' })
    @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: JwtPayload) {
        // Força o creatorId para ser o ID do usuário autenticado (ignora qualquer valor enviado)
        const taskData = {
            ...createTaskDto,
            creatorId: user.sub,
        };
        return await this.taskService.create(taskData);
    }

    @Put()
    @ApiOperation({ summary: 'Atualizar tarefa', description: 'Atualiza os dados de uma tarefa existente' })
    @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
    async update(@Body() updateTaskDto: UpdateTaskDto) {
        return await this.taskService.update(updateTaskDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar tarefas', description: 'Retorna uma lista de tarefas com filtros opcionais' })
    @ApiResponse({ status: 200, description: 'Lista de tarefas retornada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findAll(@Query() filters?: FindAllFilters) {
        return await this.taskService.findAll(filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar tarefa por ID', description: 'Retorna os detalhes de uma tarefa específica' })
    @ApiParam({ name: 'id', description: 'ID da tarefa', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Tarefa encontrada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.taskService.findOne(id);
    }

    @Post('comment')
    @ApiOperation({ summary: 'Criar comentário', description: 'Adiciona um comentário a uma tarefa' })
    @ApiResponse({ status: 201, description: 'Comentário criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
    async createComment(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: JwtPayload) {
        // Força o userId para ser o ID do usuário autenticado (ignora qualquer valor enviado)
        const commentData = {
            ...createCommentDto,
            userId: user.sub,
        };
        return await this.taskService.createComment(commentData);
    }

    @Get('comment/:taskId')
    @ApiOperation({ summary: 'Listar comentários da tarefa', description: 'Retorna todos os comentários de uma tarefa específica' })
    @ApiParam({ name: 'taskId', description: 'ID da tarefa', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Lista de comentários retornada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
    async findAllComments(@Param('taskId', ParseIntPipe) taskId: number) {
        return await this.taskService.findAllComments(taskId);
    }
}
