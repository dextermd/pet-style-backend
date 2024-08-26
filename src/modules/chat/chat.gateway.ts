import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import * as console from 'console';
import { UsersService } from '../users/users.service';
import { WsJwtGuard } from '../auth/jwt/ws-jwt.guard';
import { MessagesService } from '../messages/messages.service';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { MessageDto } from '../messages/dto/message.dto';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateMessageStatus')
  async handleStatusUpdate(
    @MessageBody() data: { messageId: string; status: number },
    @ConnectedSocket() client: Socket,
  ) {
    await this.messagesService.updateMessageStatus(data.messageId, data.status);
    this.server.to(client.handshake.query.userId).emit('statusUpdated', data);
    //this.server.emit('statusUpdated', statusUpdate);
  }

  // @UseGuards(WsJwtGuard)
  // handleConnection(client: Socket) {
  //   console.log(`Client connected: ${client.id}`);
  //   client.join(client.handshake.query.userId);
  // }
  @UseGuards(WsJwtGuard)
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const userId = client.handshake.query.userId;
    console.log('User ID: ', userId);
    client.join(userId);
  }

  @UseGuards(WsJwtGuard)
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  @UseGuards(WsJwtGuard)
  async handleMessage(
    @MessageBody() message: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    const userId = client.handshake.query.userId;
    const sender = await this.usersService.findUserById(userId);
    const receiver = await this.usersService.findUserById(message.to);

    const savedMessage = await this.messagesService.saveMessage(
      sender,
      receiver,
      message.text,
      message.status,
    );

    this.server.to(message.to).emit('receiveMessage', savedMessage);
  }

  @SubscribeMessage('getChatHistory')
  @UseGuards(WsJwtGuard)
  async handleGetChatHistory(
    @MessageBody() data: { senderId: string; receiverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messageDto: MessageDto[] =
      await this.messagesService.getMessagesBetweenUsers(
        data.senderId,
        data.receiverId,
      );
    console.log('Messages: ', messageDto);
    client.emit('chatHistory', messageDto);
  }
}
