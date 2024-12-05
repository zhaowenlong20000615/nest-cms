import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
import { ConfigurationService } from './configuration.service'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private redisClient: Redis

  constructor(private readonly configurationService: ConfigurationService) {
    this.redisClient = new Redis({
      host: this.configurationService.redisHost,
      port: this.configurationService.redisPort,
      password: this.configurationService.redisPassword,
    })
  }
  onModuleDestroy() {
    this.redisClient.quit()
  }

  getClient(): Redis {
    return this.redisClient
  }

  set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) return this.redisClient.set(key, value, 'EX', ttl)
    else return this.redisClient.set(key, value)
  }

  get(key: string): Promise<string> {
    return this.redisClient.get(key)
  }

  del(key: string): Promise<number> {
    return this.redisClient.del(key)
  }
}
