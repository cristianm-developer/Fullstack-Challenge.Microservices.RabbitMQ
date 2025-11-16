import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getPostgresConfig = (configService: ConfigService): TypeOrmModuleOptions => {

    const POSTGRES_USER = configService.get<string>('POSTGRES_USER');
    const POSTGRES_PASSWORD = configService.get<string>('POSTGRES_PASSWORD');
    const POSTGRES_DB = configService.get<string>('POSTGRES_DB');
    const POSTGRES_PORT = configService.get<number>('POSTGRES_PORT');
    const POSTGRES_HOST = configService.get<string>('POSTGRES_HOST');

    const NODE_ENV = configService.get<string>('NODE_ENV');

    if(!POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DB || !POSTGRES_PORT || !POSTGRES_HOST) {
        throw new Error('POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT, POSTGRES_HOST is not set');
    }
    
    return {
        type: 'postgres',
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        username: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: NODE_ENV === 'development' ? true : false
    }
}

export const initPostgresql = async () => {
    return TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => getPostgresConfig(configService),
    })
}