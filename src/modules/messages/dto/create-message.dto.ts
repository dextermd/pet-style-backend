export class CreateMessageDto {
  from: string;
  to: string;
  text: string;
  status?: number;
}
