import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class ProductImageDto {
  @ApiProperty()
  @IsString()
  url!: string;

  @ApiProperty()
  @IsString()
  alt!: string;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  slug!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Precio en centavos COP' })
  @IsInt()
  @Min(0)
  priceInCents!: number;

  @ApiPropertyOptional({ description: 'Precio anterior (tachado) en sale' })
  @IsOptional()
  @IsInt()
  @Min(0)
  compareAtPriceInCents?: number | null;

  @ApiPropertyOptional({ type: [ProductImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiProperty({ enum: ['hombre', 'mujer', 'unisex'] })
  @IsIn(['hombre', 'mujer', 'unisex'])
  section!: 'hombre' | 'mujer' | 'unisex';

  @ApiProperty()
  @IsString()
  category!: string;

  @ApiPropertyOptional({ description: 'Slug de colección o null' })
  @IsOptional()
  @IsString()
  collection?: string | null;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isBasic?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isBlank?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  onSale?: boolean;

  @ApiPropertyOptional({ description: 'Visible en tienda' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
