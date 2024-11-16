import { Controller, Get } from '@nestjs/common'
import { UserService } from 'src/shared/services/user.service'

@Controller('admin/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async index() {
    const data = await this.userService.findAll()
    return { data }
  }
}
