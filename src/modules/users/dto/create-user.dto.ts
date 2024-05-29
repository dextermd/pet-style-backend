import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail(
    {},
    {
      message: 'The email address must be valid and properly formatted.',
    },
  )
  email: string;

  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'The input must be a minimum of 6 characters long.',
  })
  password: string;

  @IsString()
  image?: string;

  @IsString()
  notification_token?: string;
}
