import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { AccessController } from './controllers/access.controller';
import { TagController } from "./controllers/tag.controller";
import { ArticleController } from "./controllers/article.controller";
@Module({
    controllers: [DashboardController, UserController, RoleController, AccessController, TagController, ArticleController],
})
export class AdminModule {
}
