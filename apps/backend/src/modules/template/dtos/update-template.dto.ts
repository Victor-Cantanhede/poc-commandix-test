import { IsString, IsBoolean, IsIn, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TemplateFieldType } from '../entities/template.entity';

export class TemplateFieldDto {
  @IsString()
  name!: string;

  @IsIn(['text', 'number', 'date', 'boolean'])
  type!: TemplateFieldType;

  @IsBoolean()
  required!: boolean;
}

export class UpdateTemplateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateFieldDto)
  schema!: TemplateFieldDto[];
}
