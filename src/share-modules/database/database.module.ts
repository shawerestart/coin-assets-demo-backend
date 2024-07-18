import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbLogger } from '@src/common/logger';
import { ormConfig } from '@src/config/typeORM.config';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...ormConfig,
          synchronize:
            JSON.parse(process.env.NEST_MYSQL_SYNCHRONIZE || 'false') ?? false,
          logger: new WinstonAdaptor(dbLogger, ['error', 'warn'], true),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
