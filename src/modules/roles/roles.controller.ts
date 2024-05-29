import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
