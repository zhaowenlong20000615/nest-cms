import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ArticleService } from './article.service'
import { UserService } from './user.service'
import { MailService } from './mail.service'

@Injectable()
export class NotificationService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @OnEvent('article.approval')
  async handleArticleApprovaEvent(payload: { articleId: number }) {
    const article = await this.articleService.findOne({ where: { id: payload.articleId } })
    // const users = await this.userService.findAll()
    // console.log(11111111, payload, article, users)
    const mailOptions = {
      to: 'ZHAOWENLONG0615@163.com',
      subject: `文章审核请求: ${article.title}`,
      text: `有一篇新的文章需要审核，点击链接查看详情: http://localhost:3000/admin/articles/${payload.articleId}`,
      html: `有一篇新的文章需要审核，点击链接查看详情: http://localhost:3000/admin/articles/${payload.articleId}` + article.content,
    }
    this.mailService.sendEmail(mailOptions)
  }
}
