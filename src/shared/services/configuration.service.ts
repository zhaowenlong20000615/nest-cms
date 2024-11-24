import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  get mysqlHost(): string {
    return this.configService.get<string>('MYSQL_HOST')
  }
  get mysqlPort(): number {
    return this.configService.get<number>('MYSQL_PORT')
  }
  get mysqlDatabase(): string {
    return this.configService.get<string>('MYSQL_DB')
  }
  get mysqlUser(): string {
    return this.configService.get<string>('MYSQL_USER')
  }
  get mysqlPassword(): string {
    return this.configService.get<string>('MYSQL_PASSWORD')
  }
  get mysqlConfig() {
    return {
      host: this.mysqlHost,
      port: this.mysqlPort,
      username: this.mysqlUser,
      password: this.mysqlPassword,
      database: this.mysqlDatabase,
    }
  }

  get ossAcessKeyId(): string {
    return this.configService.get<string>('OSS_ACCESS_KEY_ID')
  }
  get ossAcessKeySecret(): string {
    return this.configService.get<string>('OSS_ACCESS_KEY_SECRET')
  }
  get ossRoleArn(): string {
    return this.configService.get<string>('OSS_STS_ROLE_ARN')
  }
  get ossRegion(): string {
    return this.configService.get<string>('OSS_REGION')
  }
  get ossBucket(): string {
    return this.configService.get<string>('OSS_BUCKET')
  }
}
