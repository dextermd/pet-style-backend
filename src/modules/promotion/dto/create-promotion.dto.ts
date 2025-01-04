import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePromotionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  image?: string;

  @IsNotEmpty()
  discount: number;

  start_date: Date;

  end_date: Date;
}
