import { MysqlBaseService } from './mysql-base.service'
import { User } from '../entities/user.entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService extends MysqlBaseService<User> {
  constructor(@InjectRepository(User) protected repository: Repository<User>) {
    super(repository)
  }
}
