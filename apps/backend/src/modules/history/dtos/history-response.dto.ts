export class HistoryResponseDto {
  id!: string;
  contractId!: string;
  action!: string;
  field!: string | null;
  oldValue!: any | null;
  newValue!: any | null;
  createdAt!: Date;
  user!: {
    name: string;
    email: string;
  };
}
