import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  nameRu: string;

  @IsNotEmpty()
  @IsString()
  nameRo: string;

  @IsNotEmpty()
  @IsString()
  descriptionRu: string;

  @IsNotEmpty()
  @IsString()
  descriptionRo: string;

  @IsNotEmpty()
  price: number;

  duration?: number;

  isActive: boolean;
}
