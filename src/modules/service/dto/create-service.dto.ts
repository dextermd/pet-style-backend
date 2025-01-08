import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  nameRu: string;

  @IsNotEmpty()
  @IsString()
  nameRo: string;

  @IsString()
  descriptionRu: string;

  @IsString()
  descriptionRo: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  duration?: number;

  isActive: boolean;
}
