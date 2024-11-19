import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AdminModule } from './admin/admin.module'
import { ApiModule } from './api/api.module'
import { SharedModule } from './shared/shared.module'
import { MethodOverride } from './shared/middlewares/method-override'
import { PropertyFilter } from './shared/middlewares/property-filter'
import { join } from 'path'
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n'

@Module({
  imports: [
    AdminModule,
    ApiModule,
    SharedModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new QueryResolver(['lang', 'l']), new HeaderResolver(['x-custom-lang']), new CookieResolver(), AcceptLanguageResolver],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MethodOverride).forRoutes('admin/**').apply(PropertyFilter).forRoutes('*')
  }
}
