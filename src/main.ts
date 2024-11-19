import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { engine } from 'express-handlebars'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as helpers from './shared/helpers'
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('hbs')
  app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      helpers,
      runtimeOptions: {
        allowProtoMethodsByDefault: true, //允许访问原型上的方法
        allowProtoPropertiesByDefault: true, //允许访问原型上的属性
      },
    }),
  )
  app.use(cookieParser())
  app.use(
    session({
      secret: 'my-secret',
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  )
  // app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalPipes(new I18nValidationPipe())
  app.useGlobalFilters(new I18nValidationExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('CMS')
    .setDescription('CMS 前后端接口')
    .setVersion('1.0')
    .addTag('CMS')
    .addCookieAuth('connect.sid') // 添加cookie认证方式，cookie的默认名称为connect.sid
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    })
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-doc', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
