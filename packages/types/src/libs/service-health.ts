export enum ServiceHealthStatus {
  Ok = "OK",
  Error = "ERROR",
  Undefined = "UNDEFINED",
}

export class ServiceHealthDto {
  name!: string;
  status?: ServiceHealthStatus;
  database?: ServiceHealthStatus;
  rabbitMqClient?: ServiceHealthStatus;
}
