import { MysqlBaseService } from './mysql-base.service'
import { User } from '../entities/user.entities'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository, UpdateResult } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { UpdateUserRolesDto } from '../dto/user.dto'
import { Role } from '../entities/role.entities'

@Injectable()
export class UserService extends MysqlBaseService<User> {
  constructor(
    @InjectRepository(User) protected repository: Repository<User>,
    @InjectRepository(Role) protected roleRepository: Repository<Role>,
  ) {
    super(repository)
  }

  async updateRoles(id: number, updateUserRolesDto: UpdateUserRolesDto): Promise<UpdateResult> {
    const user = await this.repository.findOneBy({ id })
    const roles = await this.roleRepository.findBy({ id: In(updateUserRolesDto.roleIds) })
    user.roles = roles
    await this.repository.save(user)
    return UpdateResult.from({ raw: [], affected: 1, records: [] })
  }
}
