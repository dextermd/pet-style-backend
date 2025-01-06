import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles/entities/role.entity';
import { RefreshToken } from '../refresh_token/entities/refresh_token.entity';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  private validAudiences: string[];

  constructor(
    @InjectRepository(User) private authRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {
    this.validAudiences = process.env.GOOGLE_CLIENT_IDS.split(',');
  }

  async register(user: RegisterAuthDto) {
    const { email } = user;
    const emailExist = await this.authRepository.findOneBy({ email });

    if (emailExist) {
      throw new HttpException(
        'Email address is already in use.',
        HttpStatus.CONFLICT,
      );
    }

    const newUser = this.authRepository.create(user);
    newUser.roles = await this.rolesRepository.findBy({ id: In([2]) });
    newUser.provider = 'email';

    const userSaved = await this.authRepository.save(newUser);
    return this._generateTokensAndReturnUserData(userSaved);
  }

  async login(loginData: LoginAuthDto) {
    const { email, password } = loginData;
    const userFound = await this.authRepository.findOne({
      where: { email },
      relations: ['roles', 'pets'],
    });

    if (!userFound) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await compare(password, userFound.password);
    if (!isPasswordValid) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    return this._generateTokensAndReturnUserData(userFound);
  }

  async refreshToken(oldRefreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: oldRefreshToken },
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new NotFoundException('Refresh token not found');
    }

    if (tokenEntity.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete({ token: oldRefreshToken });
      throw new HttpException('Refresh token expired', HttpStatus.CONFLICT);
    }

    const userFound = await this.authRepository.findOne({
      where: { email: tokenEntity.user.email },
      relations: ['roles', 'pets'],
    });

    if (!userFound) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._generateTokensAndReturnUserData(userFound, tokenEntity);
  }

  async _generateTokensAndReturnUserData(
    user: User,
    oldTokenEntity?: RefreshToken,
  ) {
    const rolesString = user.roles.map((role) => role.name);
    const payload = {
      id: user.id,
      name: user.name,
      roles: rolesString,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '3600s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '6d' });

    let refreshTokenEntity: RefreshToken;

    if (oldTokenEntity) {
      oldTokenEntity.token = refreshToken;
      oldTokenEntity.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      refreshTokenEntity = oldTokenEntity;
    } else {
      refreshTokenEntity = this.refreshTokenRepository.create({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user,
      });
    }

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      user: { ...user, password: undefined },
      accessToken: 'Bearer ' + accessToken,
      refreshToken: 'Bearer ' + refreshToken,
    };
  }

  async validateOAuthLogin(payload: any, provider: string): Promise<any> {
    const email = payload.email;
    const name = payload.name;
    const image = payload.picture;

    let user = await this.authRepository.findOne({
      where: { email },
      relations: ['roles', 'pets'],
    });

    if (!user) {
      user = this.authRepository.create({
        email,
        name,
        image,
        roles: await this.rolesRepository.findBy({ id: In([2]) }),
        provider,
      });
      user = await this.authRepository.save(user);
    }

    return this._generateTokensAndReturnUserData(user);
  }

  async verifyGoogleToken(token: string) {
    Logger.log(`Verifying Google ID Token: ${token}`);
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.validAudiences,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        Logger.error('Invalid Google token');
        return new UnauthorizedException('Invalid Google token');
      }
      Logger.log(`Verified Google ID Token: ${JSON.stringify(payload)}`);
      return payload;
    } catch (error) {
      Logger.error('Error verifying Google token', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async verifyAppleToken(token: string): Promise<any> {
    Logger.log(`Verifying Apple ID Token: ${token}`);
    try {
      const appleKeys = await axios.get('https://appleid.apple.com/auth/keys');
      const decodedToken = jwt.decode(token, { complete: true });
      const kid = decodedToken.header.kid;
      const key = appleKeys.data.keys.find((k) => k.kid === kid);

      if (!key) {
        Logger.error('Invalid Apple key');
        throw new UnauthorizedException('Invalid Apple key');
      }

      const publicKey = this.getPublicKey(key);

      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        audience: process.env.APPLE_CLIENT_ID,
      });

      Logger.log(`Verified Apple ID Token: ${JSON.stringify(payload)}`);
      return payload;
    } catch (error) {
      Logger.error('Error verifying Apple token', error);
      throw new UnauthorizedException('Invalid Apple token');
    }
  }

  private getPublicKey(key): string {
    return `-----BEGIN PUBLIC KEY-----\n${key.n}\n-----END PUBLIC KEY-----`;
  }

  async logout(userId: any) {
    await this.refreshTokenRepository.delete({ user: userId });
  }

  async groomerLogin(loginData: LoginAuthDto) {
    const { email, password } = loginData;

    const userFound = await this.authRepository.findOne({
      where: { email: email },
      relations: ['roles'],
    });

    if (!userFound) {
      throw new HttpException(
        'Пользователь с таким email не найден',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!userFound.roles.find((role) => role.name === 'Administrator')) {
      throw new HttpException(
        'Пользователь не является администратором',
        HttpStatus.FORBIDDEN,
      );
    }
    const isPasswordValid = await compare(password, userFound.password);
    if (!isPasswordValid) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    if (!isPasswordValid) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    return this._generateTokensAndReturnUserData(userFound);
  }
}
