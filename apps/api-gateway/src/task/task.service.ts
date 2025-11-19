import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { 
    CreateTaskDto as CreateTaskDtoType, 
    FindAllFilters as FindAllFiltersType, 
    TASK_PATTERNS, 
    UpdateTaskDto as UpdateTaskDtoType,
    CreateCommentDto as CreateCommentDtoType,
    COMMENT_PATTERNS,
    AddLogDto as AddLogDtoType,
} from '@repo/types';
import { firstValueFrom } from 'rxjs';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindAllFilters } from './dto/find-all-filters.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class TaskService {
    constructor(
        @Inject('TASK_CLIENT')
        private readonly taskClient: ClientProxy,
    ) {}

    async create(createTaskDto: CreateTaskDto & { creatorId: number }) {
        const payload: CreateTaskDtoType = {
            title: createTaskDto.title,
            description: createTaskDto.description,
            prazo: createTaskDto.prazo,
            priority: createTaskDto.priority,
            userIds: createTaskDto.userIds,
            creatorId: createTaskDto.creatorId,
        };
        return await firstValueFrom(
            this.taskClient.send(TASK_PATTERNS.CREATE_TASK, payload)
        );
    }

    async update(updateTaskDto: UpdateTaskDto) {
        const payload: UpdateTaskDtoType = {
            id: updateTaskDto.id,
            title: updateTaskDto.title,
            description: updateTaskDto.description,
            deadline: updateTaskDto.deadline,
            priority: updateTaskDto.priority,
            status: updateTaskDto.status,
            userIds: updateTaskDto.userIds,
        };
        return await firstValueFrom(
            this.taskClient.send(TASK_PATTERNS.UPDATE_TASK, payload)
        );
    }

    async findAll(filters?: FindAllFilters) {
        const payload: FindAllFiltersType = filters ? {
            title: filters.title,
            status: filters.status,
            priority: filters.priority,
            userId: filters.userId,
        } : {};
        return await firstValueFrom(
            this.taskClient.send(TASK_PATTERNS.FIND_ALL_TASKS, payload)
        );
    }

    async findOne(id: number) {
        return await firstValueFrom(
            this.taskClient.send(TASK_PATTERNS.FIND_ONE_TASK, id)
        );
    }

    async createComment(createCommentDto: CreateCommentDto & { userId: number }) {
        const payload: CreateCommentDtoType = {
            content: createCommentDto.content,
            taskId: createCommentDto.taskId,
            userId: createCommentDto.userId,
        };
        return await firstValueFrom(
            this.taskClient.send(COMMENT_PATTERNS.CREATE_COMMENT, payload)
        );
    }

    async findAllComments(taskId: number) {
        return await firstValueFrom(
            this.taskClient.send(COMMENT_PATTERNS.FIND_ALL_COMMENTS, taskId)
        );
    }

    async addLog(logDto: AddLogDtoType) {
        return await firstValueFrom(
            this.taskClient.send(TASK_PATTERNS.ADD_TASK_LOG, logDto)
        );
    }
}
