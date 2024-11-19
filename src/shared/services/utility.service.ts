import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UtilityService {
  hashPassword(password: string) {
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(password, salt)
    return hash
  }

  comparsePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
  }
}
