import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '@repo/types';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    jwtService = {
      verify: jest.fn(),
    } as any;

    strategy = new JwtStrategy(jwtService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return payload if token is valid', async () => {
    const mockPayload: JwtPayload = { sub: 1 };
    jwtService.verify = jest.fn().mockReturnValue(mockPayload);

    const result = await strategy.validate('valid-token');

    expect(result).toEqual(mockPayload);
    expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
  });

  it('should throw UnauthorizedException if token is not provided', async () => {
    await expect(strategy.validate('')).rejects.toThrow(UnauthorizedException);
    await expect(strategy.validate('')).rejects.toThrow('Token not provided');
  });

  it('should throw UnauthorizedException if token is expired', async () => {
    const expiredError = new Error('Token expired');
    expiredError.name = 'TokenExpiredError';
    jwtService.verify = jest.fn().mockImplementation(() => {
      throw expiredError;
    });

    await expect(strategy.validate('expired-token')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate('expired-token')).rejects.toThrow(
      'Token validation failed',
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const invalidError = new Error('Invalid token');
    invalidError.name = 'JsonWebTokenError';
    jwtService.verify = jest.fn().mockImplementation(() => {
      throw invalidError;
    });

    await expect(strategy.validate('invalid-token')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate('invalid-token')).rejects.toThrow(
      'Token validation failed',
    );
  });

  it('should throw UnauthorizedException if payload is invalid', async () => {
    jwtService.verify = jest.fn().mockReturnValue({});

    await expect(strategy.validate('token-without-sub')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate('token-without-sub')).rejects.toThrow(
      'Token validation failed',
    );
  });

  it('should throw UnauthorizedException if payload sub is missing', async () => {
    jwtService.verify = jest.fn().mockReturnValue({ sub: null });

    await expect(strategy.validate('token-with-null-sub')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate('token-with-null-sub')).rejects.toThrow(
      'Token validation failed',
    );
  });

  it('should throw UnauthorizedException for other validation errors', async () => {
    const otherError = new Error('Other error');
    otherError.name = 'OtherError';
    jwtService.verify = jest.fn().mockImplementation(() => {
      throw otherError;
    });

    await expect(strategy.validate('token-with-other-error')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate('token-with-other-error')).rejects.toThrow(
      'Token validation failed',
    );
  });
});

