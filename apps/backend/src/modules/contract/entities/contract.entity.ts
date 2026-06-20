export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export class ContractEntity {
  constructor(
    public id: string,
    public tenantId: string,
    public status: ContractStatus,
    public templateSnapshot: Record<string, unknown>[],
    public payload: Record<string, unknown>,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null,
  ) {}
}
