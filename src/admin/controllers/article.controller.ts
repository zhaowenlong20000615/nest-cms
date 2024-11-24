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
  ParseArrayPipe,
  ArgumentMetadata,
  StreamableFile,
  Header,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AdminExectionFilter } from '../filters/admin-exection.filter'
import { ArticleService } from 'src/shared/services/article.service'
import { ParseOptionalInt } from 'src/shared/pipes/parse-optional-int.pipe'
import { In, Like } from 'typeorm'
import { CreateArticleDto, UpdateArticleDto } from 'src/shared/dto/article.dto'
import { Result } from 'src/shared/vo/result'
import { I18n, I18nContext } from 'nestjs-i18n'
import { Response } from 'express'
import { TagService } from 'src/shared/services/tag.service'
import { CategoryService } from 'src/shared/services/category.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { WordExportService } from 'src/shared/services/word-export.service'
import { PptExportService } from 'src/shared/services/ppt-export.service'
import { ExcelExportService } from 'src/shared/services/excel-export.service'

@Controller('admin/articles')
@UseFilters(AdminExectionFilter)
@ApiTags('admin/articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly eventEmitter: EventEmitter2,
    private readonly wordExportService: WordExportService,
    private readonly pptExportService: PptExportService,
    private readonly excelExportService: ExcelExportService,
  ) {}

  @Get()
  @Render('article/article-list')
  async index(
    @Query('keyword') keyword: string = '',
    @Query('page', new ParseOptionalInt(1)) page: number,
    @Query('limit', new ParseOptionalInt(10)) limit: number,
  ) {
    const where = keyword ? [{ title: Like(`%${keyword}%`) }] : {}
    const skip = (page - 1) * limit
    const [articles, total] = await this.articleService.findAllWithPagination({
      where,
      skip,
      take: limit,
      relations: ['categories', 'tags'],
    })
    const pageCount = Math.ceil(total / limit)
    return { articles, keyword, page, limit, total, pageCount }
  }

  @Get('create')
  @Render('article/article-form')
  async createForm() {
    const tags = await this.tagService.findAll()
    const categoryTree = await this.categoryService.findAll()
    return { tags, categoryTree }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Headers('accept') accept: string, @Res() res: Response) {
    const article = await this.articleService.findOne({ where: { id }, relations: ['categories', 'tags'] })
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
    const article = await this.articleService.findOne({ where: { id }, relations: ['categories', 'tags'] })
    const tags = await this.tagService.findAll()
    const categoryTree = await this.categoryService.findAll()
    if (article) return { article, tags, categoryTree }
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

  @Put('approval/:id')
  async approval(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') accept: string,
    @I18n() i18n: I18nContext,
  ) {
    this.eventEmitter.emit('article.approval', { articleId: id })
    const result = await this.articleService.update(id, updateArticleDto)
    if (accept === 'application/json' && result.affected === 1) return Result.success(i18n.t('response.editSuccess'))
    if (result.affected === 1) res.redirect('/admin/articles')
    throw new HttpException('该article不存在', HttpStatus.NOT_FOUND)
  }

  @Get('word-export/:ids')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  async wordExport(@Param('ids', ParseArrayPipe) ids: string[], @Res({ passthrough: true }) res: Response) {
    const numIds = ids.map((id) => Number(id))
    const articles = await this.articleService.find({ where: { id: In(numIds) }, relations: ['categories', 'tags'] })
    const buffer = await this.wordExportService.exportToWord(articles)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(articles?.length <= 1 ? articles[0].title : 'word文章')}.docx"`,
    )
    return new StreamableFile(buffer)
  }

  @Get('ppt-export/:ids')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
  async pptExport(@Param('ids', ParseArrayPipe) ids: string[], @Res({ passthrough: true }) res: Response) {
    const numIds = ids.map((id) => Number(id))
    const articles = await this.articleService.find({ where: { id: In(numIds) }, relations: ['categories', 'tags'] })
    const buffer = await this.pptExportService.exportToPpt(articles)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(articles?.length <= 1 ? articles[0].title : 'ppt文章')}.pptx"`,
    )
    return new StreamableFile(buffer)
  }

  @Get('excel-export/:ids')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async excelExport(@Param('ids', ParseArrayPipe) ids: string[], @Res({ passthrough: true }) res: Response) {
    const numIds = ids.map((id) => Number(id))
    const articles = await this.articleService.find({ where: { id: In(numIds) }, relations: ['categories', 'tags'] })
    const buffer = await this.excelExportService.exportToExcel(articles)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(articles?.length <= 1 ? articles[0].title : 'ppt文章')}.xlsx"`,
    )
    return new StreamableFile(new Uint8Array(buffer))
  }
}
