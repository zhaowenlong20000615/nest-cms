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

  get smtpHost(): string {
    return this.configService.get<string>('SMTP_HOST')
  }
  get smtpPort(): string {
    return this.configService.get<string>('SMTP_PORT')
  }
  get smtpUser(): string {
    return this.configService.get<string>('SMTP_USER')
  }
  get smtpPass(): string {
    return this.configService.get<string>('SMTP_PASS')
  }

  get mongodbHost(): string {
    return this.configService.get<string>('MONGO_HOST')
  }
  get mongodbProt(): string {
    return this.configService.get<string>('MONGO_PORT')
  }
  get mongodbDB(): string {
    return this.configService.get<string>('MONGO_DB')
  }
  get mongodUser(): string {
    return this.configService.get<string>('MONGO_USER')
  }
  get mongodbPassword(): string {
    return this.configService.get<string>('MONGO_PASSWORD')
  }
  get mongodbConfig() {
    return {
      uri: `mongodb://${this.mongodbHost}:${this.mongodbProt}/${this.mongodbDB}`,
    }
  }

  get ipApiUrl(): string {
    return this.configService.get<string>('IP_API_URL')
  }

  get weatherApiUrl(): string {
    return this.configService.get<string>('WEATHER_API_URL')
  }

  get weatherApiKey(): string {
    return this.configService.get<string>('WEATHER_API_KEY')
  }

  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST')
  }

  get redisPort(): number {
    return this.configService.get<number>('REDIS_PORT')
  }

  get redisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD')
  }
}
