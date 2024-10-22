import { IsNumber, IsString } from "class-validator";

export class ResultDto {
  @IsString()
  id: string;

  @IsString()
  message: string;

  @IsString()
  receiver: string;

  @IsNumber()
  segments: number;

  @IsNumber()
  statusId: number;

  @IsString()
  statusName: string;

  @IsString()
  dateCreate: string;
}
