import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { AddLogDto, CreateTaskDto, FindAllFilters, TASK_PATTERNS, UpdateTaskDto } from '@repo/types';

@Controller()
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @MessagePattern(TASK_PATTERNS.CREATE_TASK)
    async create(@Payload() createTaskDto: CreateTaskDto) {
        return await this.tasksService.create(createTaskDto);
    }

    @MessagePattern(TASK_PATTERNS.UPDATE_TASK)
    async update(@Payload() updateTaskDto: UpdateTaskDto) {
        return await this.tasksService.update(updateTaskDto);
    }

    @MessagePattern(TASK_PATTERNS.FIND_ALL_TASKS)
    async findAll(@Payload() filters?: FindAllFilters) {
        return await this.tasksService.findAll(filters);
    }

    @MessagePattern(TASK_PATTERNS.FIND_ONE_TASK)
    async findOne(@Payload() id: number) {
        return await this.tasksService.findOne(id);
    }

    @MessagePattern(TASK_PATTERNS.ADD_TASK_LOG)
    async addLog(@Payload() logDto: AddLogDto) {
        return await this.tasksService.addLog(logDto);
    }

}

