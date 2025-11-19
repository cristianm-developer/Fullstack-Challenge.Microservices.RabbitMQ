import { ConfigService } from "@nestjs/config";

import { ConfigModule } from "@nestjs/config"
import { JwtModule, JwtModuleAsyncOptions } from "@nestjs/jwt"

const jwtOptions: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
    }),
    inject: [ConfigService],
}

export const initJwtModule = () => JwtModule.registerAsync(jwtOptions);