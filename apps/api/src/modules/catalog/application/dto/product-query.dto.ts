import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const toBool = ({ value }: { value: unknown }) =>
  value === 'true' || value === true;

export class ProductQueryDto {
  @ApiPropertyOptional({ description: 'Sección: hombre | mujer | unisex' })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional({ description: 'Slug de la colección' })
  @IsOptional()
  @IsString()
  collection?: string;

  @ApiPropertyOptional({ description: 'Categoría (p.ej. hoodies, denim)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Búsqueda por nombre' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Solo destacados' })
  @IsOptional()
  @Transform(toBool)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Solo básicos' })
  @IsOptional()
  @Transform(toBool)
  @IsBoolean()
  basic?: boolean;

  @ApiPropertyOptional({ description: 'Solo blanks' })
  @IsOptional()
  @Transform(toBool)
  @IsBoolean()
  blank?: boolean;

  @ApiPropertyOptional({ description: 'Solo en sale' })
  @IsOptional()
  @Transform(toBool)
  @IsBoolean()
  sale?: boolean;

  @ApiPropertyOptional({ default: 50, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;
}
