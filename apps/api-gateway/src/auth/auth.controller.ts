import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Realizar login', description: 'Autentica um usuário e retorna tokens de acesso' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Registrar novo usuário', description: 'Cria uma nova conta de usuário no sistema' })
    @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou usuário já existe' })
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this.authService.register(registerUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('users')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Listar todos os usuários', description: 'Retorna uma lista de todos os usuários cadastrados' })
    @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findAll() {
        return await this.authService.findAll();
    }

    @UseGuards(AuthGuard)
    @Put('users')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Atualizar usuário', description: 'Atualiza os dados de um usuário existente' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async update(@Body() updateUserDto: UpdateUserDto) {
        return await this.authService.update(updateUserDto);
    }
}
