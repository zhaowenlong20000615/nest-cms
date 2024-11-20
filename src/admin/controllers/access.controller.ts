import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Redirect,
  Render,
  Res,
  Headers,
  Delete,
} from '@nestjs/common'
import { I18n, I18nContext } from 'nestjs-i18n'
import { CreateAccessDto, UpdateAccessDto } from 'src/shared/dto/access.dto'
import { AccessService } from 'src/shared/services/access.service'
import { Result } from 'src/shared/vo/result'
import { Response } from 'express'

@Controller('admin/accesses')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  @Render('access/access-list')
  async index() {
    const accessTree = await this.accessService.findAll()
    return { accessTree }
  }

  @Get('create')
  @Render('access/access-form')
  async createForm() {
    const accessTree = await this.accessService.findAll()
    return { accessTree, access: {} }
  }

  @Get(':id')
  @Render('access/access-detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const access = await this.accessService.findOne({ where: { id }, relations: ['parent', 'children'] })
    return { access }
  }

  @Post()
  @Redirect('/admin/accesses')
  async create(@Body() createAccessDto: CreateAccessDto) {
    await this.accessService.create(createAccessDto)
    return Result.success('创建成功')
  }

  @Get('edit/:id')
  @Render('access/access-form')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const access = await this.accessService.findOne({ where: { id }, relations: ['parent', 'children'] })
    const accessTree = await this.accessService.findAll()
    if (access) return { access, accessTree }
    throw new HttpException('该资源不存在', HttpStatus.NOT_FOUND)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccessDto: UpdateAccessDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') accept: string,
    @I18n() i18n: I18nContext,
  ) {
    const result = await this.accessService.update(id, updateAccessDto)
    if (accept === 'application/json' && result.affected === 1) return Result.success(i18n.t('response.editSuccess'))
    if (result.affected === 1) res.redirect('/admin/accesses')
    throw new HttpException('该资源不存在', HttpStatus.NOT_FOUND)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @I18n() i18n: I18nContext) {
    const res = await this.accessService.delete(id)
    if (res.affected === 1) return Result.success(i18n.t('response.deleteSuccess'))
    throw new HttpException('该资源不存在', HttpStatus.NOT_FOUND)
  }
}