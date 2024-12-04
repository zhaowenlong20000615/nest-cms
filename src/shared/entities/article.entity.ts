import { ApiProperty } from '@nestjs/swagger'
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm'
import { Expose, Transform } from 'class-transformer'
import { Category } from './category.entity'
import { Tag } from './tag.entity'
import { ArticleStateEnum, ArticleStateEnumText } from '../enums/article.enum'
import * as dayjs from 'dayjs'

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID', example: 1 })
  id: number

  @Column({ length: 50 })
  @ApiProperty({ description: '标题', example: '标题' })
  title: string

  @Column('text')
  @ApiProperty({ description: '内容', example: '文章内容' })
  content: string

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[]

  @Column({ type: 'enum', enum: ArticleStateEnum, default: 'draft' })
  @ApiProperty({ description: '审核状态', example: '草稿' })
  state: ArticleStateEnum

  @Expose()
  @ApiProperty({ description: '审核状态文本', example: '草稿' })
  get state_text(): string {
    return ArticleStateEnumText[this.state]
  }

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '审核不通过原因', example: '内容不合要求' })
  rejectionReason: string

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

  @CreateDateColumn({ transformer: { from: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'), to: () => new Date() } })
  @ApiProperty({ description: '创建时间', example: '2024-11-16 12:18:40' })
  createdAt: Date

  @UpdateDateColumn({ transformer: { from: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'), to: () => new Date() } })
  @ApiProperty({ description: '更新时间', example: '2024-11-16 12:18:40' })
  updatedAt: Date
}
