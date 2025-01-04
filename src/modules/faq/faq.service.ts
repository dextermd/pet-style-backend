import { Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  async create(createFaqDto: CreateFaqDto) {
    const newFaq = this.faqRepository.create(createFaqDto);
    return await this.faqRepository.save(newFaq);
  }

  async findAll() {
    return await this.faqRepository.find();
  }

  async findOne(id: number) {
    return await this.faqRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    await this.faqRepository.update(id, updateFaqDto);
  }

  async remove(id: number) {
    await this.faqRepository.delete(id);
  }
}
