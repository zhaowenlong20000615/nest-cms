import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

@Injectable()
export class MongodbBaseService<T, C, U> {
  constructor(protected readonly model: Model<T>) {}

  findAll(): Promise<T[]> {
    return this.model.find()
  }

  findById(id: string): Promise<T> {
    return this.model.findById(id)
  }

  findOne(): Promise<T> {
    return this.model.findOne()
  }

  create(createDto: C): Promise<T> {
    const createdCat = new this.model(createDto)
    return createdCat.save() as Promise<T>
  }

  update(id: string, updateDto: U) {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true })
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id)
  }
}
