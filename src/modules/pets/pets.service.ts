import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { log } from 'console';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPetDto: CreatePetDto, userId: number) {
    const petData = { ...createPetDto };

    // Проверка на существование петомца у пользователя с именем нового питомца
    const pet = await this.petRepository.findOne({
      where: { userId, name: petData.name },
    });
    if (pet) {
      throw new ConflictException('Pet with this name already exists');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newPet = this.petRepository.create(petData);
    newPet.userId = user.id;
    return await this.petRepository.save(newPet);
  }

  findAll() {
    return `This action returns all pets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`;
  }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }

  async findAllByUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['pets'],
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.pets) return [];

    return user.pets;
  }
}
