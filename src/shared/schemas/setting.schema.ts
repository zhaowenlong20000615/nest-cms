import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type SettingDocument = HydratedDocument<Setting>

@Schema()
export class Setting {
  id: string

  @Prop({ required: true })
  siteName: string

  @Prop()
  siteDescription: string

  @Prop()
  contactEmail: string
}

export const settingSchema = SchemaFactory.createForClass(Setting)
settingSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
settingSchema.set('toJSON', { virtuals: true })
settingSchema.set('toObject', { virtuals: true })
