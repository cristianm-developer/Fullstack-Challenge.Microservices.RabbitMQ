

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();
if(process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env.example' });
}

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT!),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*.ts'],
    synchronize: process.env.NODE_ENV === 'development' ? true : false,
    logging: process.env.NODE_ENV === 'development' ? true : false,
});

export default dataSource;