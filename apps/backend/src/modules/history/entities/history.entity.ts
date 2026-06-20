export class HistoryEntity {
  id!: string;
  tenantId!: string;
  contractId!: string;
  userId!: string;
  action!: string;
  field!: string | null;
  oldValue!: unknown | null;
  newValue!: unknown | null;
  createdAt!: Date;
}
