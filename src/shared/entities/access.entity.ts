import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from 'typeorm'
import { AccessType } from '../dto/access.dto'

const AccessTypeText = {
  module: '模块',
  menu: '菜单',
  page: '页面',
  button: '按钮',
}

@Entity()
@Tree('materialized-path')
export class Access {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID', example: 1 })
  id: number

  @Column({ length: 50 })
  @ApiProperty({ description: '名称', example: 'name' })
  name: string

  @Column({ length: 50 })
  @ApiProperty({ description: '权限编码', example: 'deleteCode' })
  code: string

  @Column({ type: 'enum', enum: AccessType })
  @ApiProperty({ description: '类型', example: '菜单' })
  type: AccessType

  @Expose()
  @ApiProperty({ description: '类型文本', example: '激活' })
  get type_text(): string {
    return AccessTypeText[this.type]
  }

  @Column({ length: 200, nullable: true })
  @ApiProperty({ description: 'url地址', example: '/admin/users' })
  url: string

  @Column({ length: 200, nullable: true })
  @ApiProperty({ description: '描述', example: '描述' })
  description: string

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Access

  @TreeChildren()
  children: Access[]

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
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间', example: '2024-11-16 12:18:40' })
  updatedAt: Date
}
