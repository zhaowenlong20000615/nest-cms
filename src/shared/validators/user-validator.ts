import { Injectable } from '@nestjs/common'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { UserService } from '../services/user.service'

let userService: UserService = null
@Injectable()
@ValidatorConstraint({ name: 'IsUsernameUnique', async: true })
export class IsUsernameUniqueConstraint implements ValidatorConstraintInterface {
  constructor(user: UserService) {
    if (!userService) userService = user
  }

  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    const res = await userService.findOneBy({ username: value })
    return !res
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    const { property, value } = validationArguments
    return `${property} ${value} is already taken!`
  }
}
