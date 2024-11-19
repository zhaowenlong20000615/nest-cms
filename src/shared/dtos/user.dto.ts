import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional, PartialType as PartialTypeSwaggerNest } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator'
import { IsUsernameUniqueConstraint } from '../validators/user-validator'
import { PartialType, OmitType } from '@nestjs/mapped-types'
import { i18nValidationMessage } from 'nestjs-i18n'

export class CreateUserDto {
  @ValidatorUsername()
  @ApiUsername()
  username: string

  @ValidatorPassword()
  @ApiPassword()
  password: string

  @ValidatorMobile()
  @ApiMobile()
  mobile: string

  @ValidatorEmail()
  @ApiEmail()
  email: string

  @ValidatorStatus()
  @ApiStatus()
  status: number

  @ValidatorIsSuper()
  @ApiIsSuper()
  is_super: boolean

  @ValidatorSort()
  @ApiSort()
  sort: number
}

export class UpdateUserDto extends PartialTypeSwaggerNest(OmitType(PartialType(CreateUserDto), ['password', 'username'])) {
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number

  @IsOptional()
  username: string

  @IsOptional()
  password: string
}

function ValidatorUsername() {
  return applyDecorators(
    Validate(IsUsernameUniqueConstraint, []),
    IsString(),
    MinLength(1, { message: i18nValidationMessage('validation.minLength', { field: 'username', length: 1 }) }),
    MaxLength(20, { message: i18nValidationMessage('validation.maxLength', { field: 'username', length: 20 }) }),
  )
}

function ApiUsername() {
  return applyDecorators(ApiProperty({ description: '用户名', example: '张三' }))
}

function ValidatorPassword() {
  return applyDecorators(
    IsString(),
    MinLength(6, { message: i18nValidationMessage('validation.minLength', { field: 'password', length: 6 }) }),
    MaxLength(8, { message: i18nValidationMessage('validation.maxLength', { field: 'password', length: 8 }) }),
  )
}

function ApiPassword() {
  return applyDecorators(ApiProperty({ description: '密码', example: '123456' }))
}

function ValidatorMobile() {
  return applyDecorators(
    IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty', { field: 'mobile' }) }),
    IsMobilePhone(),
    IsString(),
  )
}

function ApiMobile() {
  return applyDecorators(ApiProperty({ description: '手机号', example: '13111111111' }))
}

function ValidatorEmail() {
  return applyDecorators(IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty', { field: 'mobile' }) }), IsEmail())
}

function ApiEmail() {
  return applyDecorators(ApiProperty({ description: '邮件', example: '张三@qq.com' }))
}

function ValidatorStatus() {
  return applyDecorators(
    IsNumber(),
    IsOptional(),
    Type(() => Number),
  )
}

function ApiStatus() {
  return applyDecorators(ApiProperty({ description: '生效状态', example: '1 可用 0 禁用' }), ApiPropertyOptional())
}

function ValidatorIsSuper() {
  return applyDecorators(
    IsBoolean(),
    IsOptional(),
    Type(() => Boolean),
  )
}

function ApiIsSuper() {
  return applyDecorators(ApiProperty({ description: '是否超级管理员', example: 'true,1 是 false,0 否' }), ApiPropertyOptional())
}

function ValidatorSort() {
  return applyDecorators(
    IsNumber(),
    IsOptional(),
    Type(() => Number),
  )
}

function ApiSort() {
  return applyDecorators(ApiProperty({ description: '排序号', example: 100 }), ApiPropertyOptional())
}
