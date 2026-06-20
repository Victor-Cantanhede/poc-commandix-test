export class LogHistoryDto {
  contractId!: string;
  userId!: string;
  action!: string;
  field?: string;
  oldValue?: unknown;
  newValue?: unknown;
}
