import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto, UpdateUserDto } from 'src/shared/dtos/user.dto'
import { UserService } from 'src/shared/services/user.service'
import { UtilityService } from 'src/shared/services/utility.service'
import { Result } from 'src/shared/vo/result'
import { AdminExectionFilter } from '../filters/admin-exection.filter'
import { Response } from 'express'
import { ParseOptionalInt } from 'src/shared/pipes/parse-optional-int.pipe'
import { Like } from 'typeorm'
import { I18n, I18nContext } from 'nestjs-i18n'

@Controller('admin/users')
@UseFilters(AdminExectionFilter)
@ApiTags('admin/users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly utilityService: UtilityService,
  ) {}

  @Get()
  @Render('user/user-list')
  async index(
    @Query('keyword') keyword: string = '',
    @Query('page', new ParseOptionalInt(1)) page: number,
    @Query('limit', new ParseOptionalInt(10)) limit: number,
  ) {
    const where = keyword ? [{ username: Like(`%${keyword}%`) }, { email: Like(`%${keyword}%`) }] : {}
    const skip = (page - 1) * limit
    const [users, total] = await this.userService.findAllWithPagination({ where, skip, take: limit })
    const pageCount = Math.ceil(total / limit)
    return { users, keyword, page, limit, total, pageCount }
  }

  @Get('create')
  @Render('user/user-form')
  createForm() {
    return {}
  }

  @Get(':id')
  @Render('user/user-detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOneBy({ id })
    return { user }
  }

  @Post()
  @Redirect('/admin/users')
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password) createUserDto.password = this.utilityService.hashPassword(createUserDto.password)
    await this.userService.create(createUserDto)
    return Result.success('创建成功')
  }

  @Get('edit/:id')
  @Render('user/user-form')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOneBy({ id })
    if (user) return { user }
    throw new HttpException('该用户不存在', HttpStatus.NOT_FOUND)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') accept: string,
    @I18n() i18n: I18nContext,
  ) {
    if (updateUserDto.password) updateUserDto.password = this.utilityService.hashPassword(updateUserDto.password)
    const result = await this.userService.update(id, updateUserDto)
    if (accept === 'application/json' && result.affected === 1) return Result.success(i18n.t('response.editSuccess'))
    if (result.affected === 1) res.redirect('/admin/users')
    throw new HttpException('该用户不存在', HttpStatus.NOT_FOUND)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @I18n() i18n: I18nContext) {
    const res = await this.userService.delete(id)
    if (res.affected === 1) return Result.success(i18n.t('response.deleteSuccess'))
    throw new HttpException('该用户不存在', HttpStatus.NOT_FOUND)
  }
}
