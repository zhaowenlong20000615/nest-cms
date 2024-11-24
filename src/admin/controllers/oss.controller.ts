import { Controller, Get, UseFilters } from '@nestjs/common'
import { AdminExectionFilter } from '../filters/admin-exection.filter'
import { ApiTags } from '@nestjs/swagger'
import { OssService } from 'src/shared/services/oss.service'

@Controller('admin/oss')
@UseFilters(AdminExectionFilter)
@ApiTags('admin/oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Get('get-signature')
  async getSignature() {
    return await this.ossService.getSignature()
  }
}
