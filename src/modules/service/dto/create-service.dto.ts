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
  price: string;

  duration?: number;

  isActive: boolean;
}
