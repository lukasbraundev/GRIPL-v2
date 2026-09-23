export interface ComplianceException {
    id: number;
    complianceRuleId: number;
    condition: string;
    description: string;
}