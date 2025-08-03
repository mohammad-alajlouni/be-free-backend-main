import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { VALIDATION_MESSAGES } from 'src/constants/validation.constants';
import { QuestionStatus } from 'src/enums/questions.enums';

export class QuestionDto {
  @ApiProperty()
  @IsNotEmpty({ message: `Question ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Question ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly question: string;
}

export class AnswerQuestionDto {
  @ApiProperty()
  @IsNotEmpty({ message: `Answer ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Answer ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly answer: string;
}

export class ListQuestionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly size?: number = 4;

  @ApiProperty({ enum: QuestionStatus })
  @IsOptional()
  @IsIn([QuestionStatus.ANSWERED, QuestionStatus.NOT_ANSWERED])
  @Type(() => Number)
  readonly status?: QuestionStatus;
}
