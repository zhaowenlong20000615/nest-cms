import { ApiProperty, PartialType as PartialTypeNestSwagger } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'
import { IdValidators, SortValidators, StatusValidators } from '../decorators/dto.decorator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateRoleDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: '名称', example: 'name' })
  name: string

  @StatusValidators()
  @ApiProperty({ description: '状态', example: 1 })
  status: number

  @SortValidators()
  @ApiProperty({ description: '排序号', example: 100 })
  sort: number
}

export class UpdateRoleDto extends PartialTypeNestSwagger(PartialType(CreateRoleDto)) {
  @IdValidators()
  id: number
}

export class UpdateRoleAccessesDto {
  readonly accessIds: number[]
}
