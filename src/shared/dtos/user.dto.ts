import { PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsEmail, IsMobilePhone, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MaxLength(2)
  @MaxLength(20)
  username: string

  @IsString()
  @MaxLength(6)
  @MaxLength(8)
  password: string

  @IsMobilePhone()
  @IsString()
  mobile: string

  @IsEmail()
  email: string

  @IsNumber()
  status: number

  @IsBoolean()
  @Type(() => Boolean)
  is_super: boolean

  @IsNumber()
  @IsOptional()
  sort: number
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number
}
