import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Tag } from '../entities/tag.entity'
import { Repository } from 'typeorm'
import { MysqlBaseService } from './mysql-base.service'

@Injectable()
export class TagService extends MysqlBaseService<Tag> {
  constructor(@InjectRepository(Tag) protected repository: Repository<Tag>) {
    super(repository)
  }
}
