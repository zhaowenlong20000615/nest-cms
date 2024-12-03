import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty, PartialType as PartialTypeNestSwagger } from '@nestjs/swagger'

export class CreateSettingDto {
  @ApiProperty({ description: '网站名称', example: 'CMS网站' })
  siteName: string

  @ApiProperty({ description: '网站描述', example: '网站描述' })
  siteDescription: string

  @ApiProperty({ description: '联系人邮件', example: 'example@qq.com' })
  contactEmail: string
}

export class UpdateSettingDto extends PartialTypeNestSwagger(PartialType(CreateSettingDto)) {
  id: string
}
