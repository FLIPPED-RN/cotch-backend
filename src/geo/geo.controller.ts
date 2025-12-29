import { Controller, Get, Query } from '@nestjs/common';
import { GeoService } from './geo.service';

@Controller('geo')
export class GeoController {
  constructor(private readonly geo: GeoService) {}

  @Get()
  geocode(@Query('address') address: string) {
    return this.geo.geocode(address);
  }
}
