import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  async create(role: CreateRoleDto) {
    const { name } = role;
    const newRole = this.rolesRepository.create(role);

    const roleFound = await this.rolesRepository.findOneBy({ name: name });
    if (roleFound) {
      throw new HttpException('This role already exists.', HttpStatus.CONFLICT);
    }
    return await this.rolesRepository.save(newRole);
  }

  async findAll() {
    return await this.rolesRepository.find();
  }

  async findOne(id: number) {
    const roleFound = await this.rolesRepository.findOneBy({ id: id });

    if (!roleFound) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return roleFound;
  }

  async update(id: number, role: UpdateRoleDto) {
    return await `This action updates a #${id} role`;
  }

  async remove(id: number) {
    return await `This action removes a #${id} role`;
  }
}
