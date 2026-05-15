import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @IsString()
  @MaxLength(128)
  category: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  colors: string[];

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  @MaxLength(12000)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specifications?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  sizes?: string[];
}
