import { Injectable } from '@nestjs/common'
// 导入 ExcelJS 库，用于创建和操作 Excel 文件
import * as ExcelJS from 'exceljs'

@Injectable()
export class ExcelExportService {
  exportToExcel(source: any[]) {
    const data = source.map((article) => ({
      title: article.title,
      categories: article.categories.map((c) => c.name).join(', '),
      tags: article.tags.map((t) => t.name).join(', '),
      state: article.state,
      createdAt: article.createdAt,
    }))
    const columns = [
      { header: '标题', key: 'title', width: 30 },
      { header: '分类', key: 'categories', width: 20 },
      { header: '标签', key: 'tags', width: 20 },
      { header: '状态', key: 'state', width: 15 },
      { header: '创建时间', key: 'createdAt', width: 20 },
    ]

    // 创建一个新的 Excel 工作簿
    const workbook = new ExcelJS.Workbook()
    // 添加一个新的工作表，并命名为 '统计'
    const worksheet = workbook.addWorksheet('统计')
    // 设置工作表的列，根据传入的列定义数组
    worksheet.columns = columns
    // 遍历数据数组，将每一项数据作为一行添加到工作表中
    data.forEach((item) => {
      worksheet.addRow(item)
    })
    // 将工作簿内容写入缓冲区，并返回该缓冲区（用于进一步处理或保存）
    return workbook.xlsx.writeBuffer()
  }
}
