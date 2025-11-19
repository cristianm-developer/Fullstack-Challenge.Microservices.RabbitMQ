import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('rel_user_task')
export class RelUserTask {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @ManyToOne(() => Task, (task) => task.userTasks, {
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

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

