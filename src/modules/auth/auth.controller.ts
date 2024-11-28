import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtRolesGuard } from './jwt/jwt-roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: RegisterAuthDto) {
    return await this.authService.register(user);
  }

  @Post('login')
  async login(@Body() loginData: LoginAuthDto) {
    return await this.authService.login(loginData);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    return await this.authService.refreshToken(refreshToken);
  }

  @Post('google')
  async googleLogin(@Body('token') token: string) {
    Logger.log(`Received Google ID Token: ${token}`);
    try {
      const payload = await this.authService.verifyGoogleToken(token);
      return await this.authService.validateOAuthLogin(payload, 'google');
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
      return await this.authService.validateOAuthLogin(payload, 'apple');
    } catch (error) {
      Logger.error('Error during Apple login', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  async logout(@Req() req: any) {
    return await this.authService.logout(req.user.userId);
  }
}
