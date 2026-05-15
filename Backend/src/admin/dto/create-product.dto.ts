import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
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
}
