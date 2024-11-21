import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './services/configuration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { UserService } from './services/user.service';
import { IsUsernameUniqueConstraint } from './validators/user-validator';
import { UtilityService } from './services/utility.service';
import { Role } from './entities/role.entities';
import { RoleService } from './services/role.service';
import { Access } from './entities/access.entities';
import { AccessService } from './services/access.service';
import { Tag } from './entities/tag.entity';
import { TagService } from './services/tag.service';
import { Article } from "./entities/article.entity";
import { ArticleService } from "./services/article.service";
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
        TypeOrmModule.forFeature([User, Role, Access, Tag, Article]),
    ],
    providers: [ConfigurationService, UserService, IsUsernameUniqueConstraint, UtilityService, RoleService, AccessService, TagService, ArticleService],
    exports: [ConfigurationService, UserService, IsUsernameUniqueConstraint, UtilityService, RoleService, AccessService, TagService, ArticleService],
})
export class SharedModule {
}
