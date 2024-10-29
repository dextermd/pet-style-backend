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

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}

  @SubscribeMessage('updateMessageStatus')
  async handleStatusUpdate(
    @MessageBody() data: { messageId: string; status: number },
    @ConnectedSocket() client: Socket,
  ) {
    await this.messagesService.updateMessageStatus(data.messageId, data.status);
    this.server.to(client.handshake.query.userId).emit('statusUpdated', data);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const userId = client.handshake.query.userId;
    client.join(userId);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('msgToServer')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    try {
      const savedMessage = await this.messagesService.create(createMessageDto);

      await this.messagesService.updateMessageStatus(
        savedMessage.id.toString(),
        1,
      );

      savedMessage.status = 1;

      this.server.to(client.id).emit('messageSent', {
        oldMessageId: createMessageDto.id,
        newMessageId: savedMessage.id,
        status: 1,
      });

      this.server
        .to(createMessageDto.receiverId.toString())
        .emit('receiveMessage', savedMessage);

      return savedMessage;
    } catch (error) {
      console.log('Error: ', error);
      throw error;
    }
  }

  @SubscribeMessage('getChatHistory')
  async handleGetChatHistory(
    @MessageBody() data: { senderId: string; receiverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const createMessageDto: CreateMessageDto[] =
      await this.messagesService.getMessagesBetweenUsers(
        data.senderId,
        data.receiverId,
      );
    client.emit('chatHistory', createMessageDto);
  }
}
