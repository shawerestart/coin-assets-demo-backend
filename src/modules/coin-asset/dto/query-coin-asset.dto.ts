import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryCoinAssetDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  filter_asset_id?: string;
}
