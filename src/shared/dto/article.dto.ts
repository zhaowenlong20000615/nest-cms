import { ApiProperty, PartialType as PartialTypeNestSwagger } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IdValidators, StatusValidators, SortValidators } from '../decorators/dto.decorator';

export class CreateArticleDto {
    @IsString()
    @ApiProperty({ description: '名称', example: 'name' })
    name: string;

    @StatusValidators()
    @ApiProperty({ description: '状态', example: 1 })
    status: number;

    @SortValidators()
    @ApiProperty({ description: '排序号', example: 100 })
    sort: number;
}

export class UpdateArticleDto extends PartialTypeNestSwagger(PartialType(CreateArticleDto)) {
    @IdValidators()
    id: number;
}