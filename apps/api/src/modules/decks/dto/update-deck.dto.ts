import { PartialType } from '@nestjs/swagger';
import { CreateDeckDto } from './create-deck.dto.js';

export class UpdateDeckDto extends PartialType(CreateDeckDto) {}
