import { InjectRepository } from '@nestjs/typeorm'
import { Role } from '../entities/role.entities'
import { MysqlBaseService } from './mysql-base.service'
import { In, Repository, UpdateResult } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { UpdateRoleAccessesDto } from '../dto/role.dto'
import { Access } from '../entities/access.entities'

@Injectable()
export class RoleService extends MysqlBaseService<Role> {
  constructor(
    @InjectRepository(Role) repository: Repository<Role>,
    @InjectRepository(Access) protected accessRepository: Repository<Access>,
  ) {
    super(repository)
  }

  async updateAccess(id: number, updateRoleAccessesDto: UpdateRoleAccessesDto): Promise<UpdateResult> {
    console.log(2222222222, id, updateRoleAccessesDto)

    const role = await this.repository.findOneBy({ id })
    const accesses = await this.accessRepository.findBy({ id: In(updateRoleAccessesDto.accessIds) })
    role.accesses = accesses
    await this.repository.save(role)
    return UpdateResult.from({ raw: [], affected: 1, records: [] })
  }
}
