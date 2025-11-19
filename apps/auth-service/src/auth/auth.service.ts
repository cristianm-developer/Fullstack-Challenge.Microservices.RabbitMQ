import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from './entities/auth.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import {
  AuthResponse,
  ListedUserDto,
  LoginUserDto,
  RefreshTokenDto,
  RegisterUserDto,
  UpdateUserDto,
} from '@repo/types';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>,
  ) {}

  async login(authData: LoginUserDto): Promise<AuthResponse> {
    const isEmail = authData.usernameOrEmail.includes('@');
    const user = await this.repository.findOne({
      where: {
        [isEmail ? 'email' : 'username']: authData.usernameOrEmail,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const isPasswordValid = await argon2.verify(
      user.password,
      authData.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.generateTokens(user.id);
  }

  async register(authData: RegisterUserDto): Promise<AuthResponse> {
    const user = await this.repository.findOne({
      where: [{ email: authData.email }, { username: authData.username }],
    });

    if (user) {
      throw new ConflictException('O usuario ja existe.');
    }

    const hashedPassword = await argon2.hash(authData.password);
    const newUser = this.repository.create({
      ...authData,
      password: hashedPassword,
    });
    await this.repository.save(newUser);
    return this.generateTokens(newUser.id);
  }

  async update(authData: UpdateUserDto): Promise<{ message: string }> {
    const user = await this.repository.findOne({
      where: {
        id: authData.id,
      },
    });

    if (!user) {
      throw new NotFoundException('O usuario nao existe.');
    }

    this.repository.update(authData.id, authData);
    return { message: 'Usuario atualizado com sucesso' };
  }

  refreshToken(payload: RefreshTokenDto): AuthResponse {
    try {
      const decoded = this.jwtService.verify(payload.refreshToken);
      return this.generateTokens(decoded.sub);
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }
  }

  async findAll(): Promise<ListedUserDto[]> {
    const result = await this.repository.find();
    return result.map((user) => ({
      id: user.id,
      username: user.username,
    }));
  }

  private generateTokens(userId: number): AuthResponse {
    const JWT_ACCESS_EXPIRES =
      this.configService.get<string>('JWT_ACCESS_EXPIRES');
    const JWT_REFRESH_EXPIRES = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES',
    );

    const payload = { sub: userId };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: JWT_ACCESS_EXPIRES as any,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: JWT_REFRESH_EXPIRES as any,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_ACCESS_EXPIRES!,
    };
  }
}
