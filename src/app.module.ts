import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import 'winston-daily-rotate-file';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from '@src/common/exceptions/exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as _ from 'lodash';
import { CacheModule } from '@src/share-modules/cache/cache.module';
import { DatabaseModule } from './share-modules/database/database.module';
import { GlobalValidationPipe } from './common/pipes/global.validation.pipe';
import { ConfigModule as AppConfigModule } from '@nestjs/config';
import { CoinAssetModule } from '@modules/coin-asset/coin-asset.module';
@Module({
  imports: [
    CacheModule,
    DatabaseModule,
    CoinAssetModule,
    AppConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    {
      // 异常过滤器，格式化错误输出
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      // 全局拦截器
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      // 全局参数校验 pipe
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    // {
    //   // 全局注册权限守卫, 配合 Permission 装饰器使用
    //   provide: APP_GUARD,
    //   useClass: PermissionGuard,
    // },
    Logger,
    AppService,
  ],
})
export class AppModule {}
