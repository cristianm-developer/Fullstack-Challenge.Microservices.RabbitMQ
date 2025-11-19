import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '@repo/types';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtStrategy: jest.Mocked<JwtStrategy>;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    jwtStrategy = {
      validate: jest.fn(),
    } as any;

    guard = new AuthGuard(jwtStrategy);

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
      }),
    } as any;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if the request is authenticated', async () => {
    const mockPayload: JwtPayload = { sub: 1 };
    jwtStrategy.validate = jest.fn().mockResolvedValue(mockPayload);

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(jwtStrategy.validate).toHaveBeenCalledWith('valid-token');
    expect(mockExecutionContext.switchToHttp().getRequest().user).toEqual(mockPayload);
  });

  it('should throw UnauthorizedException if authorization header is missing', async () => {
    const contextWithoutAuth = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
    } as any;

    await expect(guard.canActivate(contextWithoutAuth)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(contextWithoutAuth)).rejects.toThrow(
      'Authorization header not found',
    );
  });

  it('should throw UnauthorizedException if token is missing', async () => {
    const contextWithoutToken = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer ',
          },
        }),
      }),
    } as any;

    await expect(guard.canActivate(contextWithoutToken)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(contextWithoutToken)).rejects.toThrow(
      'Token not provided',
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    jwtStrategy.validate = jest
      .fn()
      .mockRejectedValue(new UnauthorizedException('Invalid token'));

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      'Invalid token',
    );
  });

  it('should throw UnauthorizedException if token is expired', async () => {
    jwtStrategy.validate = jest
      .fn()
      .mockRejectedValue(new UnauthorizedException('Token has expired'));

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      'Token has expired',
    );
  });
});
