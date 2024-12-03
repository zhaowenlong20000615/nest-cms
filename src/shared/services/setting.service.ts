import { Injectable } from '@nestjs/common'
import { MongodbBaseService } from './mongodb-base.service'
import { InjectModel } from '@nestjs/mongoose'
import { Setting, SettingDocument } from '../schemas/setting.schema'
import { Model } from 'mongoose'
import { CreateSettingDto, UpdateSettingDto } from '../dto/setting.dto'

@Injectable()
export class SettingService extends MongodbBaseService<SettingDocument, CreateSettingDto, UpdateSettingDto> {
  constructor(@InjectModel(Setting.name) setting: Model<SettingDocument>) {
    super(setting)
  }
}
