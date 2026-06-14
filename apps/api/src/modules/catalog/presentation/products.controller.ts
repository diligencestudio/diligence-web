import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CatalogService } from '../application/catalog.service';
import { ProductQueryDto } from '../application/dto/product-query.dto';

@ApiTags('catalog')
@Controller('products')
export class ProductsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  @ApiOkResponse({ description: 'Lista paginada de productos activos' })
  list(@Query() query: ProductQueryDto) {
    return this.catalog.listProducts(query);
  }

  @Get(':slug')
  @ApiOkResponse({ description: 'Detalle de un producto por slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.catalog.getProductBySlug(slug);
  }
}
