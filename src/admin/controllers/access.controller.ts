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
  UseFilters,
  applyDecorators,
} from '@nestjs/common'
import { I18n, I18nContext } from 'nestjs-i18n'
import { CreateAccessDto, UpdateAccessDto } from 'src/shared/dto/access.dto'
import { AccessService } from 'src/shared/services/access.service'
import { Result } from 'src/shared/vo/result'
import { Response } from 'express'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminExectionFilter } from '../filters/admin-exection.filter'
import { Access } from 'src/shared/entities/access.entity'

@Controller('admin/accesses')
@UseFilters(AdminExectionFilter)
@ApiTags('admin/accesses')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  @Render('access/access-list')
  @ApiFindAll()
  async findAll() {
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
  @ApiFindOne()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const access = await this.accessService.findOne({ where: { id }, relations: ['parent', 'children'] })
    return { access }
  }

  @Post()
  @Redirect('/admin/accesses')
  @ApiCreate()
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
  @ApiUpdate()
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
  @ApiDelete()
  async delete(@Param('id', ParseIntPipe) id: number, @I18n() i18n: I18nContext) {
    const res = await this.accessService.delete(id)
    if (res.affected === 1) return Result.success(i18n.t('response.deleteSuccess'))
    throw new HttpException('该资源不存在', HttpStatus.NOT_FOUND)
  }
}

function ApiFindAll() {
  return applyDecorators(
    ApiOperation({ summary: '获取所有资源列表' }),
    ApiResponse({ status: HttpStatus.OK, description: '成功返回资源列表', type: [Access] }),
  )
}

function ApiFindOne() {
  return applyDecorators(
    ApiOperation({ summary: '根据ID获取某个资源信息' }),
    ApiParam({ name: 'id', description: '资源ID', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: '成功返回资源信息', type: Access }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: '资源未找到' }),
  )
}

function ApiCreate() {
  return applyDecorators(
    ApiOperation({ summary: '创建新资源' }),
    ApiBody({ description: '资源DTO', type: CreateAccessDto }),
    ApiResponse({ status: HttpStatus.CREATED, description: '资源创建成功', type: Access }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' }),
  )
}

function ApiUpdate() {
  return applyDecorators(
    ApiOperation({ summary: '更新资源信息' }),
    ApiParam({ name: 'id', description: '资源ID', type: Number }),
    ApiBody({ description: '更新资源DTO', type: UpdateAccessDto }),
    ApiResponse({ status: HttpStatus.OK, description: '资源信息更新成功', type: Result }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: '资源未找到' }),
  )
}

function ApiDelete() {
  return applyDecorators(
    ApiOperation({ summary: '根据ID删除资源' }),
    ApiParam({ name: 'id', description: '资源ID', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: '资源删除成功', type: Result }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: '资源未找到' }),
  )
}
