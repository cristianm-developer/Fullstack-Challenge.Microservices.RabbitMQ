import {
  Inject,
  Injectable,
  Logger,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from "@nestjs/common";
import { PINO_SERVICE_NAME } from "../consts/service-name.js";
import { catchError, delay, tap } from "rxjs";

@Injectable()
export class PinoLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: Logger,
    @Inject(PINO_SERVICE_NAME) private readonly serviceName: string
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const contextType = context.getType();

    if (contextType !== "rpc") {
      return next.handle();
    }

    const handler = context.getHandler();
    const patterName = handler.name;
    const messagePayload = context.getArgByIndex(0);

    const idempotencyId = messagePayload?.idempotencyId || "N/A";
    const now = Date.now();

    this.logger.log(
      `[${this.serviceName} - Task Started] Pattern: ${patterName}`,
      { idempotencyId, transport: "RabbitMQ" }
    );

    return next.handle().pipe(
      tap((result) => {
        const delay = Date.now() - now;
        this.logger.log(
          `[${this.serviceName} - Task Completed] Pattern: ${patterName}`,
          { idempotencyId, responseTime_ms: delay, result_status: "SUCCESS" }
        );
      }),
      catchError((err) => {
        const delay = Date.now() - now;
        this.logger.error(
          `[${this.serviceName} - Task Failed] Pattern: ${patterName}`,
          {
            idempotencyId,
            responseTime_ms: delay,
            result_status: "ERROR",
            error_name: err.name,
            error_message: err.message,
            error_stack: err.stack,
          }
        );
        throw err;
      })
    );
  }
}
