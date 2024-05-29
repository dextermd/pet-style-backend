import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import uploadToStorage from '../../utils/cloud_storage';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async findAll() {
    return await this.usersRepository.find({ relations: ['roles'] });
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findOneWidthRoles(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: ['roles'],
    });
  }

  async update(id: number, user: UpdateUserDto) {
    const userFound = await this.usersRepository.findOneBy({ id: id });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updateUser = Object.assign(userFound, user);
    return this.usersRepository.save(updateUser);
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
    console.log('url ' + url);

    if (url === undefined && url === null) {
      throw new HttpException(
        'The image could not be saved',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    user.image = url;
    const updateUser = Object.assign(userFound, user);
    return this.usersRepository.save(updateUser);
  }
}
