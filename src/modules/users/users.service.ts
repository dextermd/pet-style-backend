import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import uploadToStorage from '../../utils/cloud_storage';
import { Pet } from '../pets/entities/pet.entity';
import { FilesService } from '../files/files.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Pet) private petsRepository: Repository<Pet>,
    private filesService: FilesService,
  ) {}

  async create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async findAll() {
    return await this.usersRepository.find({ relations: ['roles', 'pets'] });
  }

  async update(userId: number, user: UpdateUserDto, newPassword: string) {
    if (userId == undefined) {
      throw new HttpException('ID is undefined', HttpStatus.BAD_REQUEST);
    }

    try {
      const userFound = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });

      const updateUser = Object.assign(userFound, user);

      if (newPassword) {
        updateUser.password = newPassword;
      }

      return await this.usersRepository.save(updateUser);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateWithImage(
    file: Express.Multer.File,
    id: number,
    user: UpdateUserDto,
  ) {
    const userFound = await this.usersRepository.findOneBy({ id: id });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const mapName = 'Users';
    const oldImageUrl = userFound.image;
    const url = await uploadToStorage(
      file,
      file.originalname,
      mapName,
      oldImageUrl,
    );

    if (url == undefined && url == null) {
      throw new HttpException(
        'The image could not be saved',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    user.image = url;
    const updateUser = Object.assign(userFound, user);
    return this.usersRepository.save(updateUser);
  }

  async getMe(userId: any) {
    if (!userId) {
      throw new HttpException('ID is undefined', HttpStatus.BAD_REQUEST);
    }

    try {
      const me = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['roles', 'pets'],
      });
      delete me.password;
      return me;
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async getMePets(userId: number) {
    if (!userId) {
      throw new HttpException('ID is undefined', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.petsRepository.find({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw new HttpException('Pets not found', HttpStatus.NOT_FOUND);
    }
  }

  async findUserById(id: any) {
    if (!id) {
      throw new HttpException('ID is undefined', HttpStatus.BAD_REQUEST);
    }

    try {
      const user = await this.usersRepository.findOne({
        where: {
          id,
        },
        relations: ['roles', 'pets'],
      });
      delete user.password;
      return user;
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async checkPhone(userId: any) {
    if (!userId) {
      throw new HttpException('ID is undefined', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });
      return user.phone;
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async updatePhone(userId: any, phone: string) {
    if (!userId) {
      throw new HttpException('ID is undefined', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });
      user.phone = phone;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateImage(userId: any, file: any) {
    if (!userId) {
      throw new HttpException('ID is undefined', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (file) {
        if (user.image) await this.filesService.deleteFile(user.image);
        await this.filesService.handleFileUpload(file);
        user.image = file.filename;
      }

      await this.usersRepository.save(user);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
