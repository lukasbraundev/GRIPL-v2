export type DatasetType = "GDPR" | "GENERIC_REGULATORIES";

export interface Dataset {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    type: DatasetType;
    regulationIds: number[];
}