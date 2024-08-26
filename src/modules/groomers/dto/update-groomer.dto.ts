import { PartialType } from '@nestjs/mapped-types';
import { CreateGroomerDto } from './create-groomer.dto';

export class UpdateGroomerDto extends PartialType(CreateGroomerDto) {}
