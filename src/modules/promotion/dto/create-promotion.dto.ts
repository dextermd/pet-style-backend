import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePromotionDto {
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

  image?: any;

  @IsNotEmpty()
  discount: number;

  @IsNotEmpty()
  start_date: Date;

  @IsNotEmpty()
  end_date: Date;
}
