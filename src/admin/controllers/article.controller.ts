import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Redirect,
  Render,
  Res,
  UseFilters,
  Headers,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AdminExectionFilter } from '../filters/admin-exection.filter'
import { ArticleService } from 'src/shared/services/article.service'
import { ParseOptionalInt } from 'src/shared/pipes/parse-optional-int.pipe'
import { Like } from 'typeorm'
import { CreateArticleDto, UpdateArticleDto } from 'src/shared/dto/article.dto'
import { Result } from 'src/shared/vo/result'
import { I18n, I18nContext } from 'nestjs-i18n'
import { Response } from 'express'

@Controller('admin/articles')
@UseFilters(AdminExectionFilter)
@ApiTags('admin/articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  @Render('article/article-list')
  async index(
    @Query('keyword') keyword: string = '',
    @Query('page', new ParseOptionalInt(1)) page: number,
    @Query('limit', new ParseOptionalInt(10)) limit: number,
  ) {
    const where = keyword ? [{ name: Like(`%${keyword}%`) }] : {}
    const skip = (page - 1) * limit
    const [articles, total] = await this.articleService.findAllWithPagination({ where, skip, take: limit })
    const pageCount = Math.ceil(total / limit)
    return { articles, keyword, page, limit, total, pageCount }
  }

  @Get('create')
  @Render('article/article-form')
  createForm() {
    return {}
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Headers('accept') accept: string, @Res() res: Response) {
    const article = await this.articleService.findOne({ where: { id }})
    if (accept === 'application/json' && article) return res.send({ article })
    if (article) return res.render('article/article-detail', { article })
    throw new HttpException('该article不存在', HttpStatus.NOT_FOUND)
  }

  @Post()
  @Redirect('/admin/articles')
  async create(@Body() createArticleDto: CreateArticleDto) {
    await this.articleService.create(createArticleDto)
    return Result.success('创建成功')
  }

  @Get('edit/:id')
  @Render('article/article-form')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const article = await this.articleService.findOneBy({ id })
    if (article) return { article }
    throw new HttpException('该article不存在', HttpStatus.NOT_FOUND)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') accept: string,
    @I18n() i18n: I18nContext,
  ) {
    const result = await this.articleService.update(id, updateArticleDto)
    if (accept === 'application/json' && result.affected === 1) return Result.success(i18n.t('response.editSuccess'))
    if (result.affected === 1) res.redirect('/admin/articles')
    throw new HttpException('该article不存在', HttpStatus.NOT_FOUND)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @I18n() i18n: I18nContext) {
    const res = await this.articleService.delete(id)
    if (res.affected === 1) return Result.success(i18n.t('response.deleteSuccess'))
    throw new HttpException('该article不存在', HttpStatus.NOT_FOUND)
  }
}
