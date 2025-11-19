import { TaskPriority, TaskStatus } from "./tasks.enum";

export class TaskDto {  
    id!: number;
    title!: string;
    description?: string;
    deadline?: Date;
    priority!: TaskPriority;
    status!: TaskStatus;
    userIds!: number[];
    createdAt!: Date;
}
export class CreateTaskDto {
    title!: string;
    description?: string;
    prazo?: Date;
    priority?: TaskPriority;
    userIds!: number[];
    creatorId!: number;
}

export class UpdateTaskDto {
    id!: number;
    title?: string;
    description?: string;
    deadline?: Date;
    priority?: TaskPriority;
    status?: TaskStatus;
    userIds?: number[];
}

export class FindAllFilters {
    title?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    userId?: number;
}

export class AddLogDto {
    taskId!: number;
    userId!: number;
    change!: string;
}