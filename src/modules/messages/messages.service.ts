import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const sender = await this.userRepository.findOne({
      where: { id: createMessageDto.senderId },
    });
    console.log('Sender: ', sender);
    const receiver = await this.userRepository.findOneBy({
      id: createMessageDto.receiverId,
    });
    console.log('Receiver: ', receiver);
    const message = this.messagesRepository.create({
      text: createMessageDto.text,
      sender,
      receiver,
      status: createMessageDto.status,
    });

    return await this.messagesRepository.save(message);
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
    await this.messagesRepository.update(messageId, { status: status });
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
      return {
        id: message.id,
        text: message.text,
        senderId: message.sender.id,
        receiverId: message.receiver.id,
        status: message.status,
        createdAt: message.createdAt,
      };
    });
  }
}
