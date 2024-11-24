import { ApiProperty } from '@nestjs/swagger'
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Tree, TreeChildren, TreeParent } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity()
@Tree('materialized-path')
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID', example: 1 })
  id: number

  @Column({ length: 50, unique: true })
  @ApiProperty({ description: '名称', example: 'name' })
  name: string

  @TreeChildren({ cascade: true })
  children: Category[]

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Category

  @Column({ default: 1 })
  @ApiProperty({ description: '生效状态', example: 1 })
  status: number

  @Expose()
  @ApiProperty({ description: '生效状态文本', example: '激活' })
  get status_text(): string {
    return this.status === 1 ? '激活' : '未激活'
  }

  @Column({ default: 100 })
  @ApiProperty({ description: '排序号', example: 100 })
  sort: number

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间', example: '2024-11-16 12:18:40' })
  createAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间', example: '2024-11-16 12:18:40' })
  updateAt: Date
}
