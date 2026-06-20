import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class OnboardingDto {
  @IsString()
  @IsNotEmpty()
  tenantName!: string;

  @IsString()
  @IsNotEmpty()
  userName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateTenantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class TenantResponseDto {
  id!: string;
  name!: string;
  createdAt!: Date;
}
