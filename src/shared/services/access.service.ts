import { InjectRepository } from '@nestjs/typeorm'
import { MysqlBaseService } from './mysql-base.service'
import { TreeRepository, UpdateResult } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Access } from '../entities/access.entities'
import { CreateAccessDto, UpdateAccessDto } from '../dto/access.dto'

@Injectable()
export class AccessService extends MysqlBaseService<Access> {
  constructor(@InjectRepository(Access) protected repository: TreeRepository<Access>) {
    super(repository)
  }

  findAll(): Promise<Access[]> {
    return this.repository.findTrees({ relations: ['parent', 'children'] })
  }

  async create(createAccessDto: CreateAccessDto): Promise<Access> {
    const { parentId, ...dto } = createAccessDto
    const access = this.repository.create(dto)
    if (parentId) {
      access.parent = await this.repository.findOneBy({ id: parentId })
    }
    return this.repository.save(access)
  }

  async update(id: number, updateAccessDto: UpdateAccessDto): Promise<UpdateResult> {
    const { parentId, ...dto } = updateAccessDto
    const access = await this.repository.findOneBy({ id })
    Object.assign(access, dto)
    if (parentId) {
      access.parent = await this.repository.findOneBy({ id: parentId })
    }
    console.log(11111111111, access)
    await this.repository.save(access)
    return UpdateResult.from({ raw: [], affected: 1, records: [] })
  }
}
