import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateContractDto {
  @IsNotEmpty()
  @IsObject()
  payload!: Record<string, unknown>;
}
