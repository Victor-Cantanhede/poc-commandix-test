import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardingDto {
  @ApiProperty({ example: 'Minha Empresa' })
  @IsString()
  @IsNotEmpty()
  tenantName!: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  userName!: string;

  @ApiProperty({ example: 'joao@minhaempresa.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class CreateTenantDto {
  @ApiProperty({ example: 'Nova Empresa' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateTenantDto {
  @ApiProperty({ example: 'Empresa Atualizada' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class TenantResponseDto {
  @ApiProperty({ example: 'uuid-do-tenant' })
  id!: string;

  @ApiProperty({ example: 'Minha Empresa' })
  name!: string;

  @ApiProperty({ example: '2023-10-25T10:00:00Z' })
  createdAt!: Date;
}
