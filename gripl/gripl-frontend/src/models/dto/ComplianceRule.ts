export enum ComplianceSeverity {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}

export interface ComplianceRule {
	id: number;
	name: string;
	description: string | null;
	severity: ComplianceSeverity;
	regulationId: number;
}
