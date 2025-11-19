import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { 
    CreateTaskDto,
    UpdateTaskDto,
    FindAllFilters,
    AddLogDto,
    CreateCommentDto,
    TaskStatus,
    JwtPayload,
} from '@repo/types';
import { AuthGuard } from '../auth/auth.guard';

const mockTaskService = {
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  addLog: jest.fn(),
  createComment: jest.fn(),
  findAllComments: jest.fn(),
};

const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;
  const mockUser: JwtPayload = { sub: 1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should call taskService.create with correct payload', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        creatorId: 1,
        userIds: [1, 2],
      };
      const expectedResponse = { id: 1, ...createTaskDto };

      mockTaskService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(createTaskDto, mockUser);

      expect(service.create).toHaveBeenCalledWith({ ...createTaskDto, creatorId: mockUser.sub });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should call taskService.update with correct payload', async () => {
      const updateTaskDto: UpdateTaskDto = {
        id: 1,
        title: 'Updated Task',
      };
      const expectedResponse = { id: 1, title: 'Updated Task' };

      mockTaskService.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(updateTaskDto);

      expect(service.update).toHaveBeenCalledWith(updateTaskDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(controller.findAll).toBeDefined();
    });

    it('should call taskService.findAll with filters', async () => {
      const filters: FindAllFilters = { status: TaskStatus.TODO };
      const expectedResponse = [{ id: 1, title: 'Task 1' }];

      mockTaskService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(controller.findOne).toBeDefined();
    });

    it('should call taskService.findOne with id', async () => {
      const id = 1;
      const expectedResponse = { id: 1, title: 'Task 1' };

      mockTaskService.findOne.mockResolvedValue(expectedResponse);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('createComment', () => {
    it('should be defined', () => {
      expect(controller.createComment).toBeDefined();
    });

    it('should call taskService.createComment with correct payload', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        taskId: 1,
        userId: 1,
      };
      const expectedResponse = { id: 1, ...createCommentDto };

      mockTaskService.createComment.mockResolvedValue(expectedResponse);

      const result = await controller.createComment(createCommentDto, mockUser);

      expect(service.createComment).toHaveBeenCalledWith({ ...createCommentDto, userId: mockUser.sub });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAllComments', () => {
    it('should be defined', () => {
      expect(controller.findAllComments).toBeDefined();
    });

    it('should call taskService.findAllComments with taskId', async () => {
      const taskId = 1;
      const expectedResponse = [
        { id: 1, content: 'Comment 1', taskId: 1 },
        { id: 2, content: 'Comment 2', taskId: 1 },
      ];

      mockTaskService.findAllComments.mockResolvedValue(expectedResponse);

      const result = await controller.findAllComments(taskId);

      expect(service.findAllComments).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResponse);
    });
  });
});
