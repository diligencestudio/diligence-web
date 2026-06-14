import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CatalogService } from '../application/catalog.service';

@ApiTags('catalog')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  @ApiOkResponse({ description: 'Todas las colecciones, ordenadas' })
  list() {
    return this.catalog.listCollections();
  }

  @Get(':slug')
  @ApiOkResponse({ description: 'Detalle de una colección por slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.catalog.getCollectionBySlug(slug);
  }
}
