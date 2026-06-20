export class HistoryResponseDto {
  id!: string;
  contractId!: string;
  action!: string;
  field!: string | null;
  oldValue!: unknown | null;
  newValue!: unknown | null;
  createdAt!: Date;
  user!: {
    name: string;
    email: string;
  };
}
