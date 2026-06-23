import { IsString, IsBoolean, IsIn, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TemplateFieldType } from '../entities/template.entity';

export class TemplateFieldDto {
  @ApiProperty({ example: 'campo_nome' })
  @IsString()
  name!: string;

  @ApiProperty({ enum: ['text', 'number', 'date', 'boolean'], example: 'text' })
  @IsIn(['text', 'number', 'date', 'boolean'])
  type!: TemplateFieldType;

  @ApiProperty({ example: true })
  @IsBoolean()
  required!: boolean;
}

export class UpdateTemplateDto {
  @ApiProperty({
    type: [TemplateFieldDto],
    example: [
      { name: 'nome_cliente', type: 'text', required: true },
      { name: 'idade', type: 'number', required: false }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateFieldDto)
  schema!: TemplateFieldDto[];
}
