import { Injectable } from '@nestjs/common'
import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export abstract class MysqlBaseService<T> {
  constructor(protected repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find()
  }

  findOneBy(options: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOneBy(options)
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options)
  }

  create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto)
    return this.repository.save(entity)
  }

  update(id: number, updateDto: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    return this.repository.update(id, updateDto)
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id)
  }
}
