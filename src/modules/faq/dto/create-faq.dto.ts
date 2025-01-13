import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty()
  @IsString()
  questionRu: string;

  @IsNotEmpty()
  @IsString()
  questionRo: string;

  @IsNotEmpty()
  @IsString()
  answerRu: string;

  @IsNotEmpty()
  @IsString()
  answerRo: string;

  isActive?: boolean;
}
