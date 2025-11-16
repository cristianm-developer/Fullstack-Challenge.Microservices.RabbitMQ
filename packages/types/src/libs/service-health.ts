export enum ServiceHealthStatus {
    Ok = 'OK',
    Error = 'ERROR',
    Undefined = 'UNDEFINED',
}

export class ServiceHealthDto {
   status?: ServiceHealthStatus;
   database?: ServiceHealthStatus;
   rabbitMqClient?: ServiceHealthStatus;
}