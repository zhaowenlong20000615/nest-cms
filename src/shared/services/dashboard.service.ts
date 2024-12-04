import { Injectable } from '@nestjs/common'
import { UserService } from './user.service'
import { ArticleService } from './article.service'
import { CategoryService } from './category.service'
import { TagService } from './tag.service'

@Injectable()
export class DashboardService {
  constructor(
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) {}
  async getStatisticsData() {
    const [userCount, articleCount, categoryCount, tagCount, latestArticles, latestUsers, articleTrend, userGrowth] = await Promise.all([
      this.userService.count(),
      this.articleService.count(),
      this.categoryService.count(),
      this.tagService.count(),
      this.articleService.find({ order: { id: 'DESC' }, take: 5 }),
      this.userService.find({ order: { id: 'DESC' }, take: 5 }),
      this.articleService.getTrend('article'),
      this.userService.getTrend('user'),
    ])
    return { userCount, articleCount, categoryCount, tagCount, latestArticles, latestUsers, articleTrend, userGrowth }
  }
}
