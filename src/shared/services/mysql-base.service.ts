import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export abstract class MysqlBaseService<T> {
  constructor(protected repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find()
  }
}
