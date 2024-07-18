import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { CoinAssetService } from './coin-asset.service';
import { ResultResponse } from '@src/common/responses/result.response';
import { CacheService } from '@src/share-modules/cache/cache.service';
import * as _ from 'lodash';
import { QueryCoinAssetDto } from './dto/query-coin-asset.dto';
@Controller('coin-assets')
export class CoinAssetController {
  constructor(
    private readonly coinAssetService: CoinAssetService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('/assets')
  async getAssetsByFilter(@Query() queryLeagueDto: QueryCoinAssetDto) {
    const res = await this.coinAssetService.getAssetsByFilter(queryLeagueDto);
    return ResultResponse.ok(res);
  }
}
