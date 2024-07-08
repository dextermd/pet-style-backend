import { Type } from 'class-transformer';
import {
  IsDate, IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min
} from "class-validator";

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50, {
    message: 'The breed must be a maximum of 50 characters long.',
  })
  breed: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10, {
    message: 'The breed must be a maximum of 10 characters long.',
  })
  gender: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'The weight must be at least 1.' })
  @Max(50, { message: 'The weight must be a maximum of 50.' })
  weight: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15, {
    message: 'The breed must be a maximum of 10 characters long.',
  })
  behavior: string;

  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @IsString()
  description?: string;

  @IsString()
  photo?: string;
}
