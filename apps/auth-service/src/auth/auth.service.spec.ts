import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { FindOneOptions, Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto, UpdateUserDto } from '@repo/types';

jest.mock('argon2', () => ({
  hash: jest.fn().mockImplementation((password: string) => {
    return password;
  }),
  verify: jest.fn().mockImplementation((password: string, hash: string) => {
    if (password === hash) {
      return true;
    }
    return false;
  }),
}));

const mockJwtService = {
  sign: jest.fn().mockImplementation((payload: any) => {
    return payload;
  }),
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockImplementation((k: string) => {
    switch (k) {
      case 'JWT_SECRET':
        return 'test-secret';
      case 'JWT_ACCESS_EXPIRES':
        return '15m';
      case 'JWT_REFRESH_EXPIRES_IN':
        return '7d';
      default:
        return 'test-value';
    }
  }),
};

const mockRepository = {
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  findOneByOrFail: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<Auth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(Auth),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<Auth>>(getRepositoryToken(Auth));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it.each([
      [
        {
          usernameOrEmail: 'test@test.com',
          password: 'test',
        },
      ],
      [
        {
          usernameOrEmail: 'test',
          password: 'test',
        },
      ],
    ])(
      'should send email or username and password to login and return a JWT if the user exists',
      async (authData: { usernameOrEmail: string; password: string }) => {
        mockRepository.findOne.mockResolvedValue({
          id: '1',
          email: 'test@test.com',
          username: 'test',
          password: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const result = await service.login(authData);
        if (authData.usernameOrEmail.includes('@')) {
          expect(repository.findOne).toHaveBeenCalledWith({
            where: {
              email: 'test@test.com',
            },
          });
        } else {
          expect(repository.findOne).toHaveBeenCalledWith({
            where: {
              username: 'test',
            },
          });
        }
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        expect(result.expiresIn).toBeDefined();
      },
    );

    it('should throw an error if the password is incorrect', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        username: 'test',
        password: 'test',
      });
      const authData = {
        usernameOrEmail: 'test@test.com',
        password: 'incorrect',
      };
      await expect(service.login(authData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an error if the user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const payload = {
        usernameOrEmail: 'test@test.com',
        password: 'test',
      };
      await expect(service.login(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('sould be defined', () => {
      expect(service.register).toBeDefined();
    });

    it.each<RegisterUserDto>([
      {
        email: 'test@test.com',
        username: 'test',
        password: 'test',
      },
      {
        email: 'duplicated-email@test.com',
        username: 'test',
        password: 'test',
      },
    ])(
      'should register a user and return a JWT if the user is registered successfully',
      async (payload: RegisterUserDto) => {
        mockRepository.findOne.mockResolvedValue(null);
        mockRepository.create.mockResolvedValue({
          id: '1',
          email: 'test@test.com',
          username: 'test',
          password: 'test',
        });
        const result = await service.register(payload);
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        expect(result.expiresIn).toBeDefined();
      },
    );

    it('should throw an error if the user is already registered', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        username: 'test',
        password: 'test',
      });
      const payload = {
        email: 'test@test.com',
        username: 'test',
        password: 'test',
      };
      await expect(service.register(payload)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should update a user and return succesfully message', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        username: 'test',
        password: 'test',
      });
      const payload = {
        id: 1,
        email: 'test-updated@test.com',
      };

      const result = await service.update(payload);
      expect(result.message).toBe('Usuario atualizado com sucesso');
    });


    it('should throw an error if the user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const payload: UpdateUserDto = {
        id: 1,
        email: 'test-updated@test.com'
      };
      await expect(service.update(payload)).rejects.toThrow(`O usuario nao existe.`);
    });

  });

  describe('refreshToken', () => {
    it('should be defined', () => {
      expect(service.refreshToken).toBeDefined();
    });

    it('should refresh a token and return a new JWT', async () => {
      const payload = {
        refreshToken: 'test-refresh-token',
      };
      mockJwtService.verify.mockReturnValue({ sub: 1 });
      const result = service.refreshToken(payload);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBeDefined();
    });

    it('should throw an error if the refresh token is invalid', async () => {
      const payload = {
        refreshToken: 'invalid-refresh-token',
      };
      mockJwtService.verify.mockImplementation(() => {
        throw new UnauthorizedException('Token invalido');
      });
      expect(() => service.refreshToken(payload)).toThrow(UnauthorizedException);
    });

  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });

    it('should find all users and return them', async () => {
      mockRepository.find.mockResolvedValue([{
        id: '1',
        email: 'test@test.com',
        username: 'test',
        password: 'test',
      }]);
      const result = await service.findAll();
      expect(result[0]).toBeDefined();
    });

  });

});
