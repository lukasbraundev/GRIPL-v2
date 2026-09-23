export enum CompliancePerspective {
    PERSONAL_DATA = "PERSONAL_DATA",
    SENSITIVE_DATA = "SENSITIVE_DATA",
    CONSENT = "CONSENT",
    LEGAL_BASIS = "LEGAL_BASIS",
    CUSTOMER = "CUSTOMER",
    EMPLOYEE = "EMPLOYEE",
    APPROVAL = "APPROVAL",
    PROCESSOR = "PROCESSOR",
    CONTROLLER = "CONTROLLER",
    ENCRYPTION = "ENCRYPTION",
    RETENTION_PERIOD = "RETENTION_PERIOD",
}

export enum ComplianceConceptCategory {
    PERSONAL_DATA = "PERSONAL_DATA",
    SENSITIVE_DATA = "SENSITIVE_DATA",
    CONSENT = "CONSENT",
    LEGAL_BASIS = "LEGAL_BASIS",
    CUSTOMER = "CUSTOMER",
    EMPLOYEE = "EMPLOYEE",
    APPROVAL = "APPROVAL",
    PROCESSOR = "PROCESSOR",
    CONTROLLER = "CONTROLLER",
    ENCRYPTION = "ENCRYPTION",
    DELETION = "DELETION",
    RETENTION_PERIOD = "RETENTION_PERIOD",
}

export interface Constraint {
    id: number;
    complianceRuleId: number;
    perspective: CompliancePerspective;
    predicate: string;
    operator: string;
    condition: string;
    leftOperandName: string;
    leftOperandConcept: ComplianceConceptCategory;
    rightOperandName: string;
    rightOperandConcept: ComplianceConceptCategory;
}