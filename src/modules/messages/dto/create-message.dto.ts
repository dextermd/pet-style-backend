export class CreateMessageDto {
  id?: number;
  senderId: number;
  receiverId: number;
  text: string;
  status?: number;
  createdAt?: Date;
}
