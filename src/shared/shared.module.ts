import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigurationService } from './services/configuration.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserService } from './services/user.service'
import { IsUsernameUniqueConstraint } from './validators/user-validator'
import { UtilityService } from './services/utility.service'
import { Role } from './entities/role.entity'
import { RoleService } from './services/role.service'
import { Access } from './entities/access.entity'
import { AccessService } from './services/access.service'
import { Tag } from './entities/tag.entity'
import { TagService } from './services/tag.service'
import { Article } from './entities/article.entity'
import { ArticleService } from './services/article.service'
import { Category } from './entities/category.entity'
import { CategoryService } from './services/category.service'
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        type: 'mysql',
        ...configurationService.mysqlConfig,
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Role, Access, Tag, Article, Category]),
  ],
  providers: [
    ConfigurationService,
    UserService,
    IsUsernameUniqueConstraint,
    UtilityService,
    RoleService,
    AccessService,
    TagService,
    ArticleService,
    CategoryService,
  ],
  exports: [
    ConfigurationService,
    UserService,
    IsUsernameUniqueConstraint,
    UtilityService,
    RoleService,
    AccessService,
    TagService,
    ArticleService,
    CategoryService,
  ],
})
export class SharedModule {}
