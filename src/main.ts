import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { engine } from 'express-handlebars'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('hbs')
  app.engine(
    'hbs',
    engine({
      extname: '.hbs',
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
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
