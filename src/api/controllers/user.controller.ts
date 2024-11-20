import {
  applyDecorators,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto, UpdateUserDto } from 'src/shared/dto/user.dto'
import { User } from 'src/shared/entities/user.entities'
import { UserService } from 'src/shared/services/user.service'
import { Result } from 'src/shared/vo/result'

@Controller('api/users')
@ApiTags('api/users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'exposeAll' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiFindAll()
  async findAll() {
    const users = await this.userService.findAll()
    return { users }
  }

  @Get(':id')
  @ApiFindOne()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne({ where: { id } })
    if (user) return { user }
    throw new HttpException('用户未找到', HttpStatus.NOT_FOUND)
  }

  @Post()
  @ApiCreate()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto)
    return { user }
  }

  @Put(':id')
  @ApiUpdate()
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto)
    if (user.affected === 1) return Result.success('用户更新成功')
    throw new HttpException('用户未找到', HttpStatus.NOT_FOUND)
  }

  @Delete(':id')
  @ApiDelete()
  async delete(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.delete(id)
    if (user.affected === 1) return Result.success('用户删除成功')
    throw new HttpException('用户未找到', HttpStatus.NOT_FOUND)
  }
}

function ApiFindAll() {
  return applyDecorators(
    ApiOperation({ summary: '获取所有用户列表' }),
    ApiResponse({ status: HttpStatus.OK, description: '成功返回用户列表', type: [User] }),
  )
}

function ApiFindOne() {
  return applyDecorators(
    ApiOperation({ summary: '根据ID获取某个用户信息' }),
    ApiParam({ name: 'id', description: '用户ID', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: '成功返回用户信息', type: User }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: '用户未找到' }),
  )
}

function ApiCreate() {
  return applyDecorators(
    ApiOperation({ summary: '创建新用户' }),
    ApiBody({ description: '用户DTO', type: CreateUserDto }),
    ApiResponse({ status: HttpStatus.CREATED, description: '用户创建成功', type: User }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' }),
  )
}

function ApiUpdate() {
  return applyDecorators(
    ApiOperation({ summary: '更新用户信息' }),
    ApiParam({ name: 'id', description: '用户ID', type: Number }),
    ApiBody({ description: '更新用户DTO', type: UpdateUserDto }),
    ApiResponse({ status: HttpStatus.OK, description: '用户信息更新成功', type: Result }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: '用户未找到' }),
  )
}

function ApiDelete() {
  return applyDecorators(
    ApiOperation({ summary: '根据ID删除用户' }),
    ApiParam({ name: 'id', description: '用户ID', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: '用户删除成功', type: Result }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: '用户未找到' }),
  )
}
