import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthGuard, AuthService],
  exports: [AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
