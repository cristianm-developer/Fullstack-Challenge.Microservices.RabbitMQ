import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('task_log')
export class TaskLog {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @ManyToOne(() => Task, (task) => task.auditLogs, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'taskId' })
    task!: Task;

    @Column({
        name: 'taskId',
        nullable: false,
    })
    taskId!: number;
    
    @Column({
        name: 'userId',
        nullable: false,
    })
    userId!: number;

    @Column({
        type: 'text',
        nullable: false,
    })
    change!: string;

    @CreateDateColumn()
    createdAt!: Date;
}

