import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { TaskLog } from './task-log.entity';
import { RelUserTask } from './rel-user-task.entity';
import { TaskPriority, TaskStatus } from '@repo/types';


@Entity('task')
export class Task {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({
        type: 'int',
        nullable: false,
        name: 'user_id',
    })
    userId!: number;

    @Column({
        length: 255,
        type: 'varchar',
        nullable: false,
    })
    title!: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string;

    @Column({
        type: 'date',
        nullable: true,
        name: 'deadline',
    })
    deadline?: Date;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
        nullable: false,
    })
    priority!: TaskPriority;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO,
        nullable: false,
    })
    status!: TaskStatus;

    @OneToMany(() => RelUserTask, (relUserTask) => relUserTask.task)
    userTasks!: RelUserTask[];

    @OneToMany(() => Comment, (comment) => comment.task)
    comments!: Comment[];

    @OneToMany(() => TaskLog, (taskLog) => taskLog.task)
    auditLogs!: TaskLog[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

