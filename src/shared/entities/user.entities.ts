import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number

  @Column({ length: 50, unique: true })
  @ApiProperty({ description: '用户名', example: '张三' })
  username: string

  @Column()
  @ApiProperty({ description: '密码', example: '123456' })
  @Exclude()
  @ApiHideProperty()
  password: string

  @Column({ length: 15, nullable: true })
  @ApiProperty({ description: '手机号', example: '13111111111' })
  @Transform(({ value }) => (value ? value.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3') : value))
  mobile: string

  @Expose()
  @ApiProperty({ description: '联系方式', example: '邮件：张三@qq.com' })
  get contact(): string {
    return `邮件：${this.email}`
  }

  @Column({ length: 100, nullable: true })
  @ApiProperty({ description: '邮件', example: '张三@qq.com' })
  email: string

  @Column({ default: 1 }) // 1 可用 0 禁用
  @ApiProperty({ description: '生效状态', example: '1 可用 0 禁用' })
  status: number

  @Expose()
  @ApiProperty({ description: '生效状态文本', example: '激活' })
  get status_text(): string {
    return this.status === 1 ? '激活' : '未激活'
  }

  @Column({ default: false })
  @ApiProperty({ description: '是否超级管理员', example: 'true,1 是 false,0 否' })
  is_super: boolean

  @Expose()
  @ApiProperty({ description: '是否超级管理员文本', example: '是' })
  get is_super_text(): string {
    return this.is_super ? '是' : '否'
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
