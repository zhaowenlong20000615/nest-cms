import { Controller, Get, Render } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('admin')
@ApiTags('admin/dashboard')
export class DashboardController {
  @Get()
  @Render('dashboard')
  index() {
    return { title: 'aaaaaaaaaaaa' }
  }
}
