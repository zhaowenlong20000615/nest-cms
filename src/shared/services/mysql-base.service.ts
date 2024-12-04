import { Injectable } from '@nestjs/common'
import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export abstract class MysqlBaseService<T> {
  constructor(protected repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find()
  }

  find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options)
  }

  findOneBy(options: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOneBy(options)
  }

  findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]> {
    return this.repository.findBy(where)
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options)
  }

  findAllWithPagination(options: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options)
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

  count(): Promise<number> {
    return this.repository.count()
  }

  async getTrend(tableName: string) {
    const res = await this.repository.query(`
      SELECT DATE_FORMAT(createdAt,'%Y-%m-%d') as date, COUNT(*) as count from ${tableName}
      GROUP BY date ORDER BY date ASC;
   `)
    const dates = res.map((item) => item.date)
    const counts = res.map((item) => item.count)
    return { dates, counts }
  }
}
