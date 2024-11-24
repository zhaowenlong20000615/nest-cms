import { Injectable } from '@nestjs/common'
// 导入 PptxGenJS 库，用于生成 PPTX 文件
import * as PptxGenJS from 'pptxgenjs'
// 导入 html-pptxgenjs 库，用于将 HTML 转换为 PPTX 内容
import * as html2ppt from 'html-pptxgenjs'
// 使用 Injectable 装饰器将 PptExportService 标记为可注入的服务

@Injectable()
export class PptExportService {
  exportToPpt(source: any[]) {
    const pptx = new (PptxGenJS as any)()
    for (const item of source) {
      // 添加一个新的幻灯片到 PPTX
      const slide = pptx.addSlide()
      // 构建 HTML 内容，包含文章标题、状态、分类、标签和正文内容
      const htmlContent = `
        <h1>${item.title}</h1>
        <p><strong>状态:</strong> ${item.state}</p>
        <p><strong>分类:</strong> ${item.categories.map((c) => c.name).join(', ')}</p>
        <p><strong>标签:</strong> ${item.tags.map((t) => t.name).join(', ')}</p>
        <hr/>
        ${item.content}
      `
      // 使用 html-pptxgenjs 将 HTML 内容转换为 PPTX 可用的文本项
      const items = html2ppt.htmlToPptxText(htmlContent)
      // 将生成的文本项添加到幻灯片中，设置其位置和大小
      slide.addText(items, { x: 0.5, y: 0.5, w: 9.5, h: 6, valign: 'top' })
    }
    return pptx.write({ outputType: 'nodebuffer' })
  }
}
