import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CatalogService } from '../application/catalog.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../application/dto/product-write.dto';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
} from '../application/dto/collection-write.dto';

@ApiTags('admin-catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminCatalogController {
  constructor(private readonly catalog: CatalogService) {}

  // Productos (incluye inactivos)
  @Get('products')
  listProducts() {
    return this.catalog.listAllProducts();
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalog.createProduct(dto);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalog.updateProduct(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.catalog.deleteProduct(id);
  }

  // Colecciones
  @Get('collections')
  listCollections() {
    return this.catalog.listCollections();
  }

  @Post('collections')
  createCollection(@Body() dto: CreateCollectionDto) {
    return this.catalog.createCollection(dto);
  }

  @Patch('collections/:id')
  updateCollection(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.catalog.updateCollection(id, dto);
  }

  @Delete('collections/:id')
  deleteCollection(@Param('id') id: string) {
    return this.catalog.deleteCollection(id);
  }
}
