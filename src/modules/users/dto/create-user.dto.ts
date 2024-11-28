import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
  phone?: string;

  @IsString()
  image?: string;
}
