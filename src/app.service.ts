import { Injectable } from '@nestjs/common';
import { logger } from './common/logger';
import { DataSource } from 'typeorm';
import { ormConfig } from './config/typeORM.config';
import * as _ from 'lodash';
import { CacheService } from '@src/share-modules/cache/cache.service';

@Injectable()
export class AppService {
  async onModuleInit() {
    logger.info('onModuleInit');
  }

  async onModuleDestroy() {}

  getHello(): string {
    return 'Hello World!';
  }
}
