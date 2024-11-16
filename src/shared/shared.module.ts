import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigurationService } from './services/configuration.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entities'
import { UserService } from './services/user.service'

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
    TypeOrmModule.forFeature([User]),
  ],
  providers: [ConfigurationService, UserService],
  exports: [ConfigurationService, UserService],
})
export class SharedModule {}
