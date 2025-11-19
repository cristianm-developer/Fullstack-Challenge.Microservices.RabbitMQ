import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { ClientProxy } from '@nestjs/microservices';
import { 
    TASK_PATTERNS, 
    COMMENT_PATTERNS,
    CreateTaskDto,
    UpdateTaskDto,
    FindAllFilters,
    AddLogDto,
    CreateCommentDto,
    TaskStatus,
} from '@repo/types';
import { of } from 'rxjs';

describe('TaskService', () => {
  let service: TaskService;
  let taskClient: ClientProxy;

  const mockClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  const mockTaskClient = {
    ...mockClientProxy,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: 'TASK_CLIENT', useValue: mockTaskClient },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskClient = module.get<ClientProxy>('TASK_CLIENT');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should call task microservice with CREATE_TASK pattern', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        creatorId: 1,
        userIds: [1, 2],
      };
      const expectedResponse = { id: 1, ...createTaskDto };

      mockTaskClient.send.mockReturnValue(of(expectedResponse));

      const result = await service.create(createTaskDto);

      expect(taskClient.send).toHaveBeenCalledWith(TASK_PATTERNS.CREATE_TASK, createTaskDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should call task microservice with UPDATE_TASK pattern', async () => {
      const updateTaskDto: UpdateTaskDto = {
        id: 1,
        title: 'Updated Task',
      };
      const expectedResponse = { id: 1, title: 'Updated Task' };

      mockTaskClient.send.mockReturnValue(of(expectedResponse));

      const result = await service.update(updateTaskDto);

      expect(taskClient.send).toHaveBeenCalledWith(TASK_PATTERNS.UPDATE_TASK, updateTaskDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });

    it('should call task microservice with FIND_ALL_TASKS pattern', async () => {
      const filters: FindAllFilters = { status: TaskStatus.TODO };
      const expectedResponse = [{ id: 1, title: 'Task 1' }];

      mockTaskClient.send.mockReturnValue(of(expectedResponse));

      const result = await service.findAll(filters);

      expect(taskClient.send).toHaveBeenCalledWith(TASK_PATTERNS.FIND_ALL_TASKS, filters);
      expect(result).toEqual(expectedResponse);
    });

    it('should call with empty object when no filters provided', async () => {
      const expectedResponse = [{ id: 1, title: 'Task 1' }];

      mockTaskClient.send.mockReturnValue(of(expectedResponse));

      const result = await service.findAll();

      expect(taskClient.send).toHaveBeenCalledWith(TASK_PATTERNS.FIND_ALL_TASKS, {});
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(service.findOne).toBeDefined();
    });

    it('should call task microservice with FIND_ONE_TASK pattern', async () => {
      const id = 1;
      const expectedResponse = { id: 1, title: 'Task 1' };

      mockTaskClient.send.mockReturnValue(of(expectedResponse));

      const result = await service.findOne(id);

      expect(taskClient.send).toHaveBeenCalledWith(TASK_PATTERNS.FIND_ONE_TASK, id);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('addLog', () => {
    it('should be defined', () => {
      expect(service.addLog).toBeDefined();
    });

    it('should call task microservice with ADD_TASK_LOG pattern', async () => {
      const logDto: AddLogDto = {
        taskId: 1,
        userId: 1,
        change: 'Status updated',
      };
      const expectedResponse = { id: 1, ...logDto };

      mockTaskClient.send.mockReturnValue(of(expectedResponse));

      const result = await service.addLog(logDto);

      expect(taskClient.send).toHaveBeenCalledWith(TASK_PATTERNS.ADD_TASK_LOG, logDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('createComment', () => {
    it('should be defined', () => {
      expect(service.createComment).toBeDefined();
    });

    it('should call task microservice with CREATE_COMMENT pattern', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        taskId: 1,
        userId: 1,
      };
      const expectedResponse = { id: 1, ...createCommentDto };

      mockTaskClient.send.mockReturnValue(of(expectedResponse));

      const result = await service.createComment(createCommentDto);

      expect(taskClient.send).toHaveBeenCalledWith(COMMENT_PATTERNS.CREATE_COMMENT, createCommentDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAllComments', () => {
    it('should be defined', () => {
      expect(service.findAllComments).toBeDefined();
    });

    it('should call task microservice with FIND_ALL_COMMENTS pattern', async () => {
      const taskId = 1;
      const expectedResponse = [
        { id: 1, content: 'Comment 1', taskId: 1 },
        { id: 2, content: 'Comment 2', taskId: 1 },
      ];

      mockTaskClient.send.mockReturnValue(of(expectedResponse));

      const result = await service.findAllComments(taskId);

      expect(taskClient.send).toHaveBeenCalledWith(COMMENT_PATTERNS.FIND_ALL_COMMENTS, taskId);
      expect(result).toEqual(expectedResponse);
    });
  });
});
