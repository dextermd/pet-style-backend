import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { ResultDto } from './otp-result.dto';

export class OtpResponseDto {
  @IsArray()
  @Type(() => ResultDto)
  result: ResultDto[];
}
