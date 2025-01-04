import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private petRepository: Repository<Promotion>,
    private filesService: FilesService,
  ) {}
  async create(createPromotionDto: CreatePromotionDto, image: any) {
    await this.filesService.handleFileUpload(image);

    const promotionData = { ...createPromotionDto };

    const newPromotion = this.petRepository.create(promotionData);
    newPromotion.image = image.filename;
    return await this.petRepository.save(newPromotion);
  }

  async findAll() {
    return await this.petRepository.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} promotion`;
  }

  async update(
    id: number,
    updatePromotionDto: UpdatePromotionDto,
    image?: any,
  ) {
    const promotion = await this.petRepository.findOne({ where: { id } });

    if (image) {
      if (promotion.image) {
        await this.filesService.deleteFile(promotion.image, 'promotions');
      }
      await this.filesService.handleFileUpload(image);

      updatePromotionDto.image = image.filename;
    }

    const updatedPromotion = Object.assign(promotion, updatePromotionDto);
    return await this.petRepository.save(updatedPromotion);
  }

  async remove(id: number) {
    const promotion = await this.petRepository.findOne({ where: { id } });

    try {
      if (promotion.image) {
        await this.filesService.deleteFile(promotion.image, 'promotions');
      }
    } catch (error) {
      throw new Error('Error while deleting image');
    }
    return await this.petRepository.delete(id);
  }
}
