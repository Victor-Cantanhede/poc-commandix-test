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
    public templateSnapshot: any,
    public payload: any,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null,
  ) {}
}
