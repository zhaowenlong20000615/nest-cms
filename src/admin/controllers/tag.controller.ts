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
import { TagService } from 'src/shared/services/tag.service'
import { ParseOptionalInt } from 'src/shared/pipes/parse-optional-int.pipe'
import { Like } from 'typeorm'
import { CreateTagDto, UpdateTagDto } from 'src/shared/dto/tag.dto'
import { Result } from 'src/shared/vo/result'
import { I18n, I18nContext } from 'nestjs-i18n'
import { Response } from 'express'

@Controller('admin/tags')
@UseFilters(AdminExectionFilter)
@ApiTags('admin/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Render('tag/tag-list')
  async index(
    @Query('keyword') keyword: string = '',
    @Query('page', new ParseOptionalInt(1)) page: number,
    @Query('limit', new ParseOptionalInt(10)) limit: number,
  ) {
    const where = keyword ? [{ name: Like(`%${keyword}%`) }] : {}
    const skip = (page - 1) * limit
    const [tags, total] = await this.tagService.findAllWithPagination({ where, skip, take: limit })
    const pageCount = Math.ceil(total / limit)
    return { tags, keyword, page, limit, total, pageCount }
  }

  @Get('create')
  @Render('tag/tag-form')
  createForm() {
    return {}
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Headers('accept') accept: string, @Res() res: Response) {
    const tag = await this.tagService.findOne({ where: { id } })
    if (accept === 'application/json' && tag) return res.send({ tag })
    if (tag) return res.render('tag/tag-detail', { tag })
    throw new HttpException('该tag不存在', HttpStatus.NOT_FOUND)
  }

  @Post()
  @Redirect('/admin/tags')
  async create(@Body() createTagDto: CreateTagDto) {
    await this.tagService.create(createTagDto)
    return Result.success('创建成功')
  }

  @Get('edit/:id')
  @Render('tag/tag-form')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const tag = await this.tagService.findOneBy({ id })
    if (tag) return { tag }
    throw new HttpException('该tag不存在', HttpStatus.NOT_FOUND)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') accept: string,
    @I18n() i18n: I18nContext,
  ) {
    const result = await this.tagService.update(id, updateTagDto)
    if (accept === 'application/json' && result.affected === 1) return Result.success(i18n.t('response.editSuccess'))
    if (result.affected === 1) res.redirect('/admin/tags')
    throw new HttpException('该tag不存在', HttpStatus.NOT_FOUND)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @I18n() i18n: I18nContext) {
    const res = await this.tagService.delete(id)
    if (res.affected === 1) return Result.success(i18n.t('response.deleteSuccess'))
    throw new HttpException('该tag不存在', HttpStatus.NOT_FOUND)
  }
}
