import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Redirect,
  Render,
  Res,
  Headers,
  Delete,
  UseFilters,
  applyDecorators,
} from '@nestjs/common'
import { I18n, I18nContext } from 'nestjs-i18n'
import { CreateCategoryDto, UpdateCategoryDto } from 'src/shared/dto/category.dto'
import { CategoryService } from 'src/shared/services/category.service'
import { Result } from 'src/shared/vo/result'
import { Response } from 'express'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminExectionFilter } from '../filters/admin-exection.filter'
import { Category } from 'src/shared/entities/category.entity'

@Controller('admin/categories')
@UseFilters(AdminExectionFilter)
@ApiTags('admin/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Render('category/category-list')
  @ApiFindAll()
  async findAll() {
    const categoryTree = await this.categoryService.findAll()
    return { categoryTree }
  }

  @Get('create')
  @Render('category/category-form')
  async createForm() {
    const categoryTree = await this.categoryService.findAll()
    return { categoryTree, category: {} }
  }

  @Get(':id')
  @Render('category/category-detail')
  @ApiFindOne()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findOne({ where: { id }, relations: ['parent', 'children'] })
    return { category }
  }

  @Post()
  @Redirect('/admin/categories')
  @ApiCreate()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoryService.create(createCategoryDto)
    return Result.success('创建成功')
  }

  @Get('edit/:id')
  @Render('category/category-form')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findOne({ where: { id }, relations: ['parent', 'children'] })
    const categoryTree = await this.categoryService.findAll()
    if (category) return { category, categoryTree }
    throw new HttpException('该category不存在', HttpStatus.NOT_FOUND)
  }

  @Put(':id')
  @ApiUpdate()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') accept: string,
    @I18n() i18n: I18nContext,
  ) {
    const result = await this.categoryService.update(id, updateCategoryDto)
    if (accept === 'application/json' && result.affected === 1) return Result.success(i18n.t('response.editSuccess'))
    if (result.affected === 1) res.redirect('/admin/categories')
    throw new HttpException('该category不存在', HttpStatus.NOT_FOUND)
  }

  @Delete(':id')
  @ApiDelete()
  async delete(@Param('id', ParseIntPipe) id: number, @I18n() i18n: I18nContext) {
    const res = await this.categoryService.delete(id)
    if (res.affected === 1) return Result.success(i18n.t('response.deleteSuccess'))
    throw new HttpException('该category不存在', HttpStatus.NOT_FOUND)
  }
}

function ApiFindAll() {
  return applyDecorators(
    ApiOperation({ summary: '获取所有category列表' }),
    ApiResponse({ status: HttpStatus.OK, description: '成功返回category列表', type: [Category] }),
  )
}

function ApiFindOne() {
  return applyDecorators(
    ApiOperation({ summary: '根据ID获取某个category信息' }),
    ApiParam({ name: 'id', description: 'categoryID', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: '成功返回category信息', type: Category }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'category未找到' }),
  )
}

function ApiCreate() {
  return applyDecorators(
    ApiOperation({ summary: '创建新category' }),
    ApiBody({ description: 'categoryDTO', type: CreateCategoryDto }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'category创建成功', type: Category }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' }),
  )
}

function ApiUpdate() {
  return applyDecorators(
    ApiOperation({ summary: '更新category信息' }),
    ApiParam({ name: 'id', description: 'categoryID', type: Number }),
    ApiBody({ description: '更新categoryDTO', type: UpdateCategoryDto }),
    ApiResponse({ status: HttpStatus.OK, description: 'category信息更新成功', type: Result }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'category未找到' }),
  )
}

function ApiDelete() {
  return applyDecorators(
    ApiOperation({ summary: '根据ID删除category' }),
    ApiParam({ name: 'id', description: 'categoryID', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'category删除成功', type: Result }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'category未找到' }),
  )
}
