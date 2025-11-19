import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from '@repo/types';
import { AuthGuard } from './auth.guard';

const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
};

const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(controller.login).toBeDefined();
    });

    it('should call authService.login with correct payload', async () => {
      const loginDto: LoginUserDto = {
        usernameOrEmail: 'test@example.com',
        password: 'password123',
      };
      const expectedResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresIn: '3600',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('register', () => {
    it('should be defined', () => {
      expect(controller.register).toBeDefined();
    });

    it('should call authService.register with correct payload', async () => {
      const registerDto: RegisterUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      const expectedResponse = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(controller.findAll).toBeDefined();
    });

    it('should call authService.findAll', async () => {
      const expectedResponse = [
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' },
      ];

      mockAuthService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should call authService.update with correct payload', async () => {
      const updateDto: UpdateUserDto = {
        id: 1,
        email: 'updated@example.com',
      };
      const expectedResponse = {
        id: 1,
        email: 'updated@example.com',
        username: 'testuser',
      };

      mockAuthService.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(updateDto);

      expect(service.update).toHaveBeenCalledWith(updateDto);
      expect(result).toEqual(expectedResponse);
    });
  });
});
