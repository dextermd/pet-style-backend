import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // http://localhost/api/auth/register -> POST
  async register(@Body() user: RegisterAuthDto) {
    return this.authService.register(user);
  }

  @Post('login') // http://localhost/api/auth/login -> POST
  async login(@Body() loginData: LoginAuthDto) {
    return this.authService.login(loginData);
  }

  @Post('refresh') // http://localhost/api/auth/refresh -> POST
  async refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Post('google')
  async googleLogin(@Body('token') token: string) {
    Logger.log(`Received Google ID Token: ${token}`);
    try {
      const payload = await this.authService.verifyGoogleToken(token);
      return this.authService.validateOAuthLogin(payload);
    } catch (error) {
      Logger.error('Error during Google login', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('apple')
  async appleLogin(@Body('token') token: string) {
    Logger.log(`Received Apple ID Token: ${token}`);
    try {
      const payload = await this.authService.verifyAppleToken(token);
      return this.authService.validateOAuthLogin(payload);
    } catch (error) {
      Logger.error('Error during Apple login', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
