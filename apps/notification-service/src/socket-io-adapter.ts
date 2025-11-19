import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";


export class SocketIoAdapter extends IoAdapter {
    constructor(app: INestApplication) {
        const configService = app.get(ConfigService);
        super(app);

        this.configService = configService;
    }

    private configService: ConfigService;

    createIOServer(port: number, options?: ServerOptions) {
        const corsOrigin = this.configService.get<string>('CORS_ORIGIN') || '*';
        const allowedOrigins = corsOrigin.split(',').map(s => s.trim());


        const corsOptions = {
            ...options,
            cors: {
                origin: allowedOrigins,
                methods: ['GET', 'POST'],
                credentials: true,
            },
            
        };

        const server = super.createIOServer(port, corsOptions);
        return server;
    }
    
}