require('dotenv').config(); // 加载 .env 中的配置到环境变量
import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { promisify } from 'util';
import { ApiException } from '@src/common/exceptions/api.exception';
import { ErrorCode } from '@src/common/error-code.constants';
import { errorLogger } from '@src/common/logger';
import * as _ from 'lodash';
import { CoinAsset } from '@src/entities/coin-asset.entity';

@Injectable()
export class CacheService {
  // 实例化后的 redis client 对象
  private readonly client: redis.RedisClient;
  private readonly sendCommand: Function;
  constructor() {
    this.client = redis.createClient({
      host: process.env.NEST_REDIS_HOST,
      port: parseInt(process.env.NEST_REDIS_PORT),
      password: process.env.NEST_REDIS_PASSWORD,
    });

    // redis 只支持回调方式，这里封装成 promise
    this.sendCommand = promisify(this.client.sendCommand).bind(this.client);
  }

  /**
   * 执行 redis 命令（该方法可以执行任何命令，可以在该方法基础上给特定命令封装方法）
   * @param command
   * @param arg
   */
  async command(command: string, ...arg) {
    try {
      return await this.sendCommand(command, arg);
    } catch (error) {
      errorLogger.warn(error);
      throw new ApiException(ErrorCode.REDIS_COMMAND_FAIL);
    }
  }

  /**
   * 获取 字符串类型 值（基于 command 封装）
   * @param {string} key
   */
  async get(key: string) {
    return this.command('GET', key);
  }

  async set(key: string, ...value) {
    return this.command('SET', key, value);
  }

  async del(key: string) {
    return this.command('DEL', key);
  }

  async getAssets(k: string) {
    const key = `assets:${k}`;
    let data = null;
    try {
      data = JSON.parse(await this.get(key));
    } catch (error) {
      console.error('get assets error', error);
    }
    return data;
  }

  async setAssets(
    k: string,
    data: { assets: CoinAsset[] },
    expiredTime?: number,
  ) {
    const key = `assets:${k}`;
    const MIN_CACHE_TIME = 20; // second
    await this.set(
      key,
      JSON.stringify(data),
      'EX',
      expiredTime > MIN_CACHE_TIME ? expiredTime : MIN_CACHE_TIME,
    );
  }
}
