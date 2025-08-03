import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/constants/validation.constants';

export class NoteDto {
  @ApiProperty()
  @IsNotEmpty({ message: `Content ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Content ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly content: string;
}
