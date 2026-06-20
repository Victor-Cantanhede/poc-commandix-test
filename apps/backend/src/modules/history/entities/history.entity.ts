export class HistoryEntity {
  id!: string;
  tenantId!: string;
  contractId!: string;
  userId!: string;
  action!: string;
  field!: string | null;
  oldValue!: any | null;
  newValue!: any | null;
  createdAt!: Date;
}
