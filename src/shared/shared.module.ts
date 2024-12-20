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
import { OssService } from './services/oss.service'
import { NotificationService } from './services/notification.service'
import { MailService } from './services/mail.service'
import { WordExportService } from './services/word-export.service'
import { PptExportService } from './services/ppt-export.service'
import { ExcelExportService } from './services/excel-export.service'
import { SettingService } from './services/setting.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Setting, settingSchema } from './schemas/setting.schema'
import { DashboardService } from './services/dashboard.service'
import { WeatherService } from './services/weather.service'
import { SystemService } from './services/system.service'
import { RedisService } from './services/redis.service'
import { JWTService } from './services/jwt.service'
import { JwtModule } from '@nestjs/jwt'

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
    MongooseModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({ uri: configurationService.mongodbConfig.uri }),
    }),
    MongooseModule.forFeature([{ name: Setting.name, schema: settingSchema }]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        secret: configurationService.jwtSecret,
        signOptions: { expiresIn: configurationService.jwtExpiresIn },
      }),
    }),
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
    OssService,
    NotificationService,
    MailService,
    WordExportService,
    PptExportService,
    ExcelExportService,
    SettingService,
    DashboardService,
    WeatherService,
    SystemService,
    RedisService,
    JWTService,
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
    OssService,
    NotificationService,
    MailService,
    WordExportService,
    PptExportService,
    ExcelExportService,
    SettingService,
    DashboardService,
    WeatherService,
    SystemService,
    RedisService,
    JWTService,
  ],
})
export class SharedModule {}
