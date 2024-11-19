import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'

@Injectable()
export class ParseOptionalInt implements PipeTransform {
  constructor(private readonly defalutValue: number) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return this.defalutValue
    const parsedValue = parseInt(value, 10)
    if (isNaN(parsedValue)) throw new BadRequestException(`Validation Failed.${value} is not an integer.`)
    return parsedValue
  }
}
