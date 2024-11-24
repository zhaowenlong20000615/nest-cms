import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from '../entities/article.entity'
import { DeepPartial, In, Repository, UpdateResult } from 'typeorm'
import { MysqlBaseService } from './mysql-base.service'
import { CreateArticleDto, UpdateArticleDto } from '../dto/article.dto'
import { Category } from '../entities/category.entity'
import { Tag } from '../entities/tag.entity'
import { ArticleStateEnum } from '../enums/article.enum'

@Injectable()
export class ArticleService extends MysqlBaseService<Article> {
  constructor(
    @InjectRepository(Article) protected repository: Repository<Article>,
    @InjectRepository(Category) protected categoryRepository: Repository<Category>,
    @InjectRepository(Tag) protected tagRepository: Repository<Tag>,
  ) {
    super(repository)
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const { categoryIds, tagIds, ...dto } = createArticleDto
    const article = await this.repository.save(dto)
    if (categoryIds) article.categories = await this.categoryRepository.findBy({ id: In(categoryIds) })
    if (tagIds) article.tags = await this.tagRepository.findBy({ id: In(tagIds) })
    return await this.repository.save(article)
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<UpdateResult> {
    const { categoryIds, tagIds, ...dto } = updateArticleDto
    const article = await this.repository.findOne({ where: { id }, relations: ['categories', 'tags'] })
    Object.assign(article, dto)
    if (article.state === ArticleStateEnum.REJECTED || article.state === ArticleStateEnum.WITHDRAWN) article.state = ArticleStateEnum.DRAFT
    if (categoryIds) article.categories = await this.categoryRepository.findBy({ id: In(categoryIds) })
    if (tagIds) article.tags = await this.tagRepository.findBy({ id: In(tagIds) })
    await this.repository.save(article)
    return UpdateResult.from({ raw: [], affected: 1, records: [] })
  }
}
