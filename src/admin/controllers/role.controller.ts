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
import { RoleService } from 'src/shared/services/role.service'
import { ParseOptionalInt } from 'src/shared/pipes/parse-optional-int.pipe'
import { Like } from 'typeorm'
import { CreateRoleDto, UpdateRoleAccessesDto, UpdateRoleDto } from 'src/shared/dto/role.dto'
import { Result } from 'src/shared/vo/result'
import { I18n, I18nContext } from 'nestjs-i18n'
import { Response } from 'express'
import { AccessService } from 'src/shared/services/access.service'

@Controller('admin/roles')
@UseFilters(AdminExectionFilter)
@ApiTags('admin/roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly accessService: AccessService,
  ) {}

  @Get()
  @Render('role/role-list')
  async index(
    @Query('keyword') keyword: string = '',
    @Query('page', new ParseOptionalInt(1)) page: number,
    @Query('limit', new ParseOptionalInt(10)) limit: number,
  ) {
    const where = keyword ? [{ name: Like(`%${keyword}%`) }] : {}
    const skip = (page - 1) * limit
    const [roles, total] = await this.roleService.findAllWithPagination({ where, skip, take: limit })
    const pageCount = Math.ceil(total / limit)
    const accessTree = await this.accessService.findAll()
    return { roles, keyword, page, limit, total, pageCount, accessTree }
  }

  @Get('create')
  @Render('role/role-form')
  createForm() {
    return {}
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Headers('accept') accept: string, @Res() res: Response) {
    const role = await this.roleService.findOne({ where: { id }, relations: ['accesses'] })
    if (accept === 'application/json' && role) return res.send({ role })
    if (role) return res.render('role/role-detail', { role })
    throw new HttpException('该角色不存在', HttpStatus.NOT_FOUND)
  }

  @Post()
  @Redirect('/admin/roles')
  async create(@Body() createRoleDto: CreateRoleDto) {
    await this.roleService.create(createRoleDto)
    return Result.success('创建成功')
  }

  @Get('edit/:id')
  @Render('role/role-form')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleService.findOneBy({ id })
    if (role) return { role }
    throw new HttpException('该角色不存在', HttpStatus.NOT_FOUND)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') accept: string,
    @I18n() i18n: I18nContext,
  ) {
    const result = await this.roleService.update(id, updateRoleDto)
    if (accept === 'application/json' && result.affected === 1) return Result.success(i18n.t('response.editSuccess'))
    if (result.affected === 1) res.redirect('/admin/roles')
    throw new HttpException('该角色不存在', HttpStatus.NOT_FOUND)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @I18n() i18n: I18nContext) {
    const res = await this.roleService.delete(id)
    if (res.affected === 1) return Result.success(i18n.t('response.deleteSuccess'))
    throw new HttpException('该角色不存在', HttpStatus.NOT_FOUND)
  }

  @Put('/access/:id')
  async assignAccess(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleAccessesDto: UpdateRoleAccessesDto,
    @I18n() i18n: I18nContext,
  ) {
    const res = await this.roleService.updateAccess(id, updateRoleAccessesDto)
    if (res.affected === 1) return Result.success(i18n.t('response.editSuccess'))
    throw new HttpException('该用户不存在', HttpStatus.NOT_FOUND)
  }
}
