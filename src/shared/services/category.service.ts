import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from '../entities/category.entity'
import { Repository, Like } from 'typeorm'
import { MysqlBaseService } from './mysql-base.service'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'
import { TreeRepository, UpdateResult } from 'typeorm'
@Injectable()
export class CategoryService extends MysqlBaseService<Category> {
  constructor(@InjectRepository(Category) protected repository: TreeRepository<Category>) {
    super(repository)
  }

  findAll(): Promise<Category[]> {
    return this.repository.findTrees({ relations: ['parent', 'children'] })
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, ...dto } = createCategoryDto
    const category = this.repository.create(dto)
    if (parentId) {
      category.parent = await this.repository.findOneBy({ id: parentId })
    }
    return this.repository.save(category)
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<UpdateResult> {
    const { parentId, ...dto } = updateCategoryDto
    const category = await this.repository.findOneBy({ id })
    Object.assign(category, dto)
    if (parentId) {
      category.parent = await this.repository.findOneBy({ id: parentId })
    }
    await this.repository.save(category)
    return UpdateResult.from({ raw: [], affected: 1, records: [] })
  }
}
