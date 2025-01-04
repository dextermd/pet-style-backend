import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { ILike, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private filesService: FilesService,
  ) {}

  async create(createPetDto: CreatePetDto, photo: any, userId: number) {
    if (!userId) {
      throw new HttpException('User id not fount', HttpStatus.BAD_REQUEST);
    }

    await this.filesService.handleFileUpload(photo);

    const petData = { ...createPetDto };

    const pet = await this.petRepository.findOne({
      where: {
        userId,
        name: ILike(petData.name), // ILike без учета регистра
      },
    });

    if (pet) {
      throw new ConflictException('Питомец с таким именем уже существует');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const newPet = this.petRepository.create(petData);
    newPet.userId = user.id;
    newPet.photo = photo.filename;
    return await this.petRepository.save(newPet);
  }

  findAll() {
    return this.petRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const pet = await this.petRepository.findOne({ where: { id } });
    if (!pet) {
      throw new NotFoundException('Петомец не найден');
    }
    return pet;
  }

  async update(
    id: number,
    updatePetDto: UpdatePetDto,
    userId: number,
    file?: any,
  ) {
    try {
      const pet = await this.petRepository.findOne({ where: { id, userId } });

      if (file) {
        if (pet.photo) await this.filesService.deleteFile(pet.photo, 'pets');

        await this.filesService.handleFileUpload(file);
        updatePetDto.photo = file.filename;
      }

      const updatedPet = Object.assign(pet, updatePetDto);

      return this.petRepository.save(updatedPet);
    } catch (error) {
      throw new HttpException('Pet not found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: number, userId: number) {
    if (!userId)
      throw new HttpException('User id not fount', HttpStatus.BAD_REQUEST);

    const pet = await this.petRepository.findOne({ where: { id, userId } });

    if (!pet) throw new NotFoundException('Pet not found');

    const deleteFilePromise = pet.photo
      ? this.filesService.deleteFile(pet.photo, 'pets')
      : Promise.resolve();

    await this.petRepository.delete(pet.id);

    await deleteFilePromise;

    return { deletedPetId: pet.id };
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
