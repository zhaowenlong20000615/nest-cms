import { Body, Controller, Get, Post, Redirect, Render } from '@nestjs/common'
import { CreateSettingDto, UpdateSettingDto } from 'src/shared/dto/setting.dto'
import { SettingService } from 'src/shared/services/setting.service'

@Controller('admin/settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @Render('setting')
  async index() {
    let settings = await this.settingService.findOne()
    if (!settings) {
      settings = await this.settingService.create({
        siteName: '默认网站',
        siteDescription: '默认网站描述',
        contactEmail: '联系人邮箱',
      })
    }
    return { settings }
  }

  @Post()
  @Redirect('/admin/settings')
  async update(@Body() updateSettingDto: UpdateSettingDto) {
    await this.settingService.update(updateSettingDto.id, updateSettingDto)
  }
}
