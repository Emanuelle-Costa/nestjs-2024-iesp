import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TaskModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      renderPath: '/client',
    }),
    AuthModule,
    JwtModule.register({
      global: true,
      secret: 'super secret',
      // signOptions: { expiresIn: '1s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
