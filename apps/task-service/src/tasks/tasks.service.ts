import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Task } from './entities/task.entity';
import { TaskLog } from './entities/task-log.entity';
import { RelUserTask } from './entities/rel-user-task.entity';
import { AddLogDto, CreateTaskDto, FindAllFilters, ResponseDto, TASK_PATTERNS, TaskPriority, TaskStatus, UpdateTaskDto } from '@repo/types';



@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(TaskLog)
        private readonly taskLogRepository: Repository<TaskLog>,
        @InjectRepository(RelUserTask)
        private readonly relUserTaskRepository: Repository<RelUserTask>,
        @Inject('TASK_SERVICE')
        private readonly taskClient: ClientProxy,
    ) {}

    async create(createTaskDto: CreateTaskDto): Promise<ResponseDto<Task>> {
        const task = this.taskRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            deadline: createTaskDto.prazo,
            priority: createTaskDto.priority || TaskPriority.MEDIUM,
            status: TaskStatus.TODO,
            userId: createTaskDto.creatorId,
        });

        const savedTask = await this.taskRepository.save(task);

        if (createTaskDto.userIds && createTaskDto.userIds.length > 0) {
            for (const userId of createTaskDto.userIds) {
                const relUserTask = this.relUserTaskRepository.create({
                    taskId: savedTask.id,
                    userId: userId,
                });
                await this.relUserTaskRepository.save(relUserTask);
            }
        }

        this.taskClient.emit(TASK_PATTERNS.ADD_TASK_LOG, {
            taskId: savedTask.id,
            userId: savedTask.userId,
            change: `Tarefa criada: ${savedTask.title}, data: ${JSON.stringify(savedTask)}`,
        });

        return { message: 'Tarefa criada com sucesso', data: savedTask };
    }

    async update(updateTaskDto: UpdateTaskDto) {
        const task = await this.taskRepository.findOne({
            where: { id: updateTaskDto.id },
            relations: [ 'userTasks' ],
        });

        if (!task) {
            throw new NotFoundException('A tarefa nao existe.');
        }

        task.title = updateTaskDto.title ?? task.title;
        task.description = updateTaskDto.description ?? task.description;
        task.deadline = updateTaskDto.deadline ?? task.deadline;
        task.priority = updateTaskDto.priority ?? task.priority;
        task.status = updateTaskDto.status ?? task.status;
        let usersToAdd: number[] = [];
        let usersToRemove: number[] = [];

        if(updateTaskDto.userIds !== undefined) {
            const currentUsers = task.userTasks.map(ut => ut.userId);
            const incomingUsers = updateTaskDto.userIds;

            usersToAdd = incomingUsers.filter(id => !currentUsers.includes(id));
            usersToRemove = currentUsers.filter(id => !incomingUsers.includes(id));

            if(usersToRemove.length > 0) {
                await this.relUserTaskRepository.delete({
                    taskId: task.id,
                    userId: In(usersToRemove),
                })
            }

            if(usersToAdd.length > 0) {
                const newUserTask =  usersToAdd.map(userId => this.relUserTaskRepository.create({
                    taskId: task.id,
                    userId: userId,
                }));
                await this.relUserTaskRepository.save(newUserTask);
            }

        }

        const updatedTask = await this.taskRepository.save(task);

        const changes = {
            title: updateTaskDto.title !== undefined ? `Título: ${updateTaskDto.title}` : null,
            description: updateTaskDto.description !== undefined ? `Descrição: ${updateTaskDto.description}` : null,
            deadline: updateTaskDto.deadline !== undefined ? `Prazo: ${updateTaskDto.deadline}` : null,
            priority: updateTaskDto.priority !== undefined ? `Prioridade: ${updateTaskDto.priority}` : null,
            status: updateTaskDto.status !== undefined ? `Status: ${updateTaskDto.status}` : null,
            users: usersToAdd.length > 0 || usersToRemove.length > 0 ? `Usuários Add/Remove: ${usersToAdd.join(', ')} ${usersToRemove.length > 0 ? `- ${usersToRemove.join(', ')}` : ''}` : null,
        }

        this.taskClient.emit(TASK_PATTERNS.ADD_TASK_LOG, {
            taskId: updatedTask.id,
            userId: updatedTask.userId,
            change: `Tarefa atualizada: ${updatedTask.title}, data: ${JSON.stringify(changes)}`,
        });

        return { message: 'Tarefa atualizada com sucesso' };
    }

    async findOne(id: number) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: [
                'userTasks',
                'userTasks.user',
                'comments',
                'auditLogs',
            ],
        });

        if (!task) {
            throw new NotFoundException('A tarefa nao existe.');
        }

        return task;
    }

    async findAll(filters: FindAllFilters = {}) {
        if (filters.userId) {
            const relUserTasks = await this.relUserTaskRepository.find({
                where: { userId: filters.userId },
                relations: [
                    'task',
                    'task.userTasks',
                    'task.userTasks.user',
                    'task.comments',
                    'task.auditLogs',
                ],
            });

            let tasks = relUserTasks.map((rel) => rel.task);

            if (filters.status) {
                tasks = tasks.filter((task) => task.status === filters.status);
            }
            if (filters.priority) {
                tasks = tasks.filter(
                    (task) => task.priority === filters.priority,
                );
            }

            return tasks;
        }

        const where: any = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.priority) {
            where.priority = filters.priority;
        }

        return await this.taskRepository.find({
            where,
            relations: [
                'userTasks',
                'userTasks.user',
                'comments',
                'auditLogs',
            ],
        });
    }

    async addLog(logDto: AddLogDto) {
        const task = await this.taskRepository.findOne({
            where: { id: logDto.taskId },
        });

        if (!task) {
            throw new NotFoundException('A tarefa nao existe.');
        }

        const taskLog = this.taskLogRepository.create({
            taskId: logDto.taskId,
            userId: logDto.userId,
            change: logDto.change,
        });

        const savedLog = await this.taskLogRepository.save(taskLog);

        return savedLog;
    }
}

