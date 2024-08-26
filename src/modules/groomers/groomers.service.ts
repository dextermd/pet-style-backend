import { Injectable } from '@nestjs/common';
import { CreateGroomerDto } from './dto/create-groomer.dto';
import { UpdateGroomerDto } from './dto/update-groomer.dto';

@Injectable()
export class GroomersService {
  create(createGroomerDto: CreateGroomerDto) {
    return 'This action adds a new groomer';
  }

  findAll() {
    return `This action returns all groomers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groomer`;
  }

  update(id: number, updateGroomerDto: UpdateGroomerDto) {
    return `This action updates a #${id} groomer`;
  }

  remove(id: number) {
    return `This action removes a #${id} groomer`;
  }
}
