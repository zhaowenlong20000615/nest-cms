import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from 'src/shared/dtos/user.dto'
import { UserService } from 'src/shared/services/user.service'
import { Result } from 'src/shared/vo/result'

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll()
    return { users }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne({ where: { id } })
    return { user }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto)
    return { user }
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto)
    if (user.affected === 1) return Result.success('用户更新成功')
    throw new HttpException('用户未找到', HttpStatus.NOT_FOUND)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.delete(id)
    if (user.affected === 1) return Result.success('用户删除成功')
    throw new HttpException('用户未找到', HttpStatus.NOT_FOUND)
  }
}
