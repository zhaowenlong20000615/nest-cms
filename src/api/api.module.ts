import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  controllers: [UserController, AuthController]
})
export class ApiModule {}
