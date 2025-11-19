import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskPriority, TaskStatus } from '@repo/types';

describe('TasksController', () => {
    let controller: TasksController;
    let tasksService: TasksService;

    const mockTasksService = {
        create: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        addLog: jest.fn(),
    };

    const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        prazo: new Date('2024-12-31'),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
                    useValue: mockTasksService,
                },
            ],
        }).compile();

        controller = module.get<TasksController>(TasksController);
        tasksService = module.get<TasksService>(TasksService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should be defined', () => {
            expect(controller.create).toBeDefined();
        });

        it('should call tasksService.create with correct parameters', async () => {
            const createTaskDto = {
                title: 'Test Task',
                description: 'Test Description',
                creatorId: 1,
                userIds: [1, 2],
            };

            const expectedResult = {
                message: 'Tarefa criada com sucesso',
                data: mockTask,
            };

            mockTasksService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createTaskDto);

            expect(result).toEqual(expectedResult);
            expect(mockTasksService.create).toHaveBeenCalledWith(createTaskDto);
            expect(mockTasksService.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('update', () => {
        it('should be defined', () => {
            expect(controller.update).toBeDefined();
        });

        it('should call tasksService.update with correct parameters', async () => {
            const updateTaskDto = {
                id: 1,
                title: 'Updated Task',
                status: TaskStatus.IN_PROGRESS,
            };

            const expectedResult = {
                message: 'Tarefa atualizada com sucesso',
            };

            mockTasksService.update.mockResolvedValue(expectedResult);

            const result = await controller.update(updateTaskDto);

            expect(result).toEqual(expectedResult);
            expect(mockTasksService.update).toHaveBeenCalledWith(updateTaskDto);
            expect(mockTasksService.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('findAll', () => {
        it('should be defined', () => {
            expect(controller.findAll).toBeDefined();
        });

        it('should call tasksService.findAll with filters', async () => {
            const filters = {
                status: TaskStatus.TODO,
                priority: TaskPriority.HIGH,
            };

            const expectedResult = [mockTask];

            mockTasksService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll(filters);

            expect(result).toEqual(expectedResult);
            expect(mockTasksService.findAll).toHaveBeenCalledWith(filters);
            expect(mockTasksService.findAll).toHaveBeenCalledTimes(1);
        });

        it('should call tasksService.findAll without filters', async () => {
            const expectedResult = [mockTask];

            mockTasksService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll();

            expect(result).toEqual(expectedResult);
            expect(mockTasksService.findAll).toHaveBeenCalledWith(undefined);
            expect(mockTasksService.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOne', () => {
        it('should be defined', () => {
            expect(controller.findOne).toBeDefined();
        });

        it('should call tasksService.findOne with correct id', async () => {
            const taskId = 1;

            mockTasksService.findOne.mockResolvedValue(mockTask);

            const result = await controller.findOne(taskId);

            expect(result).toEqual(mockTask);
            expect(mockTasksService.findOne).toHaveBeenCalledWith(taskId);
            expect(mockTasksService.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('addLog', () => {
        it('should be defined', () => {
            expect(controller.addLog).toBeDefined();
        });

        it('should call tasksService.addLog with correct parameters', async () => {
            const logDto = {
                taskId: 1,
                userId: 1,
                change: 'Test change',
            };

            const expectedResult = {
                id: 1,
                taskId: 1,
                userId: 1,
                change: 'Test change',
                createdAt: new Date(),
            };

            mockTasksService.addLog.mockResolvedValue(expectedResult);

            const result = await controller.addLog(logDto);

            expect(result).toEqual(expectedResult);
            expect(mockTasksService.addLog).toHaveBeenCalledWith(logDto);
            expect(mockTasksService.addLog).toHaveBeenCalledTimes(1);
        });
    });

    
});

