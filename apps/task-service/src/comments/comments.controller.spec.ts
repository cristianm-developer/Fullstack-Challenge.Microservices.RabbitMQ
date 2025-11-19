import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '@repo/types';

describe('CommentsController', () => {
    let controller: CommentsController;
    let commentsService: CommentsService;

    const mockCommentsService = {
        create: jest.fn(),
        findAll: jest.fn(),
    };

    const mockComment = {
        id: 1,
        content: 'Test comment content',
        taskId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CommentsController],
            providers: [
                {
                    provide: CommentsService,
                    useValue: mockCommentsService,
                },
            ],
        }).compile();

        controller = module.get<CommentsController>(CommentsController);
        commentsService = module.get<CommentsService>(CommentsService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should be defined', () => {
            expect(controller.create).toBeDefined();
        });

        it('should call commentsService.create with correct parameters', async () => {
            const createCommentDto: CreateCommentDto = {
                content: 'New comment content',
                taskId: 1,
                userId: 1,
            };

            const expectedResult = {
                message: 'Comentário criado com sucesso',
                data: mockComment,
            };

            mockCommentsService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createCommentDto);

            expect(result).toEqual(expectedResult);
            expect(mockCommentsService.create).toHaveBeenCalledWith(
                createCommentDto,
            );
            expect(mockCommentsService.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('findAll', () => {
        it('should be defined', () => {
            expect(controller.findAll).toBeDefined();
        });

        it('should call commentsService.findAll with correct taskId', async () => {
            const taskId = 1;
            const expectedResult = {
                message: 'Comentários carregados com sucesso',
                data: [mockComment],
            };

            mockCommentsService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll(taskId);

            expect(result).toEqual(expectedResult);
            expect(mockCommentsService.findAll).toHaveBeenCalledWith(taskId);
            expect(mockCommentsService.findAll).toHaveBeenCalledTimes(1);
        });
    });
});
