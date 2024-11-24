import { Injectable } from '@nestjs/common'
import * as htmlToDocx from 'html-to-docx'

@Injectable()
export class WordExportService {
  exportToWord(source: any[]): Promise<Buffer> {
    let htmlContent = ''
    source.forEach((item) => {
      htmlContent += `
        <h1>${item.title}</h1>
        <p><strong>状态</strong> ${item.state}</p>
        <p><strong>分类</strong> ${item.categories.map((item) => item.name).join(',')}</p>
        <p><strong>标题</strong> ${item.tags.map((item) => item.name).join(',')}</p>
        <div>${item.content}</div>
      `
    })
    return htmlToDocx(htmlContent)
  }
}
