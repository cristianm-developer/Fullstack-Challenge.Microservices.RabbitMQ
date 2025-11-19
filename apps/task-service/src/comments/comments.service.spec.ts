import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { Task } from '../tasks/entities/task.entity';
import { CreateCommentDto } from '@repo/types';

const mockCommentRepository = {
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
};

const mockTaskRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
};

describe('CommentsService', () => {
    let service: CommentsService;
    let commentRepository: Repository<Comment>;
    let taskRepository: Repository<Task>;

    const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        deadline: new Date('2024-12-31'),
        priority: 'MEDIUM',
        status: 'TODO',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockComment = {
        id: 1,
        content: 'Test comment content',
        taskId: 1,
        userId: 1,
        task: mockTask,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockTaskClient = {
        emit: jest.fn().mockReturnValue({
            toPromise: jest.fn().mockResolvedValue(true),
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                {
                    provide: getRepositoryToken(Comment),
                    useValue: mockCommentRepository,
                },
                {
                    provide: getRepositoryToken(Task),
                    useValue: mockTaskRepository,
                },
                {
                  provide: 'TASK_SERVICE',
                  useValue: mockTaskClient,
                }
              
            ],
        }).compile();

        service = module.get<CommentsService>(CommentsService);
        commentRepository = module.get<Repository<Comment>>(
            getRepositoryToken(Comment),
        );
        taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should be defined', () => {
            expect(service.create).toBeDefined();
        });

        it('should create a comment successfully and return success message', async () => {
            const createCommentDto: CreateCommentDto = {
                content: 'New comment content',
                taskId: 1,
                userId: 1,
            };

            mockTaskRepository.findOne.mockResolvedValue(mockTask);
            mockCommentRepository.create.mockReturnValue({
                ...createCommentDto,
            });
            mockCommentRepository.save.mockResolvedValue({
                id: 1,
                ...createCommentDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const result = await service.create(createCommentDto);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: { id: createCommentDto.taskId },
            });
            expect(commentRepository.create).toHaveBeenCalled();
            expect(commentRepository.save).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result.message).toBe('Comentário criado com sucesso');
            expect(result.data?.id).toBeDefined();
            expect(result.data?.content).toBe(createCommentDto.content);
        });

        it('should throw an error with portuguese message if task does not exist', async () => {
            const createCommentDto: CreateCommentDto = {
                content: 'New comment content',
                taskId: 999,
                userId: 1,
            };

            mockTaskRepository.findOne.mockResolvedValue(null);

            await expect(service.create(createCommentDto)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.create(createCommentDto)).rejects.toThrow(
                'A tarefa nao existe.',
            );
        });
    });

    describe('findAll', () => {
        it('should be defined', () => {
            expect(service.findAll).toBeDefined();
        });

        it('should find all comments for a specific task and return success message', async () => {
            const taskId = 1;
            const comments = [mockComment, { ...mockComment, id: 2 }];

            mockTaskRepository.findOne.mockResolvedValue(mockTask);
            mockCommentRepository.find.mockResolvedValue(comments);

            const result = await service.findAll(taskId);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: { id: taskId },
            });
            expect(commentRepository.find).toHaveBeenCalledWith({
                where: { taskId },
                relations: ['task'],
            });
            expect(result).toBeDefined();
            expect(result.message).toBe('Comentários carregados com sucesso');
            expect(result.data).toBeDefined();
            expect(result.data?.length).toBe(2);
        });

        it('should return empty array if task has no comments', async () => {
            const taskId = 1;

            mockTaskRepository.findOne.mockResolvedValue(mockTask);
            mockCommentRepository.find.mockResolvedValue([]);

            const result = await service.findAll(taskId);

            expect(result.message).toBe('Comentários carregados com sucesso');
            expect(result.data).toEqual([]);
        });

        it('should throw an error with portuguese message if task does not exist', async () => {
            const taskId = 999;

            mockTaskRepository.findOne.mockResolvedValue(null);

            await expect(service.findAll(taskId)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.findAll(taskId)).rejects.toThrow(
                'A tarefa nao existe.',
            );
        });
    });
});
