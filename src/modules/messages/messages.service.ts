import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    return `This action adds a new message`;
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  async updateMessageStatus(messageId: string, status: number): Promise<void> {
    await this.messagesRepository.update(messageId, { read: status });
  }

  async saveMessage(
    sender: User,
    receiver: User,
    message: string,
    delivery: number,
  ) {
    const msg = new Message();
    msg.sender = sender;
    msg.receiver = receiver;
    msg.text = message;
    msg.read = delivery;
    await msg.save();
    return msg;
  }

  async getMessagesBetweenUsers(senderId: string, receiverId: string) {
    const messages = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where(
        '(sender.id = :senderId AND receiver.id = :receiverId) OR (sender.id = :receiverId AND receiver.id = :senderId)',
        { senderId, receiverId },
      )
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    return messages.map((message) => {
      const messageDto = new MessageDto();
      messageDto.from = message.sender.id.toString();
      messageDto.to = message.receiver.id.toString();
      messageDto.text = message.text;
      messageDto.status = message.read;
      return messageDto;
    });
  }
}
