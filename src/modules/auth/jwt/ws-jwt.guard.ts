import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './jwt.constants';
import { User } from '../../users/entities/user.entity';
export class WsJwtGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const authToken = client.handshake.query.token;

    if (!authToken) {
      throw new BadRequestException('Missing token');
    }

    const token = authToken.startsWith('Bearer ')
      ? authToken.substring(7)
      : authToken;

    try {
      const decoded = jwt.verify(token, jwtConstants.secret);
      if (decoded) {
        const user: User = decoded as User;
        client.handshake.query.userId = user.id;
        console.log('User ID Ver: ', user.id);
        return true;
      }
    } catch (e) {
      console.error('Token verification error:', e.message);
      client.emit('token_expired');
      throw new BadRequestException('Invalid token');
    }
  }
}
