import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity('comment')
export class Comment {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({
        type: 'text',
        nullable: false,
    })
    content!: string;

    @ManyToOne(() => Task, (task) => task.comments, {
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

