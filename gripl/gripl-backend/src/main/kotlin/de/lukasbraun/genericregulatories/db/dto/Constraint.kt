package de.lukasbraun.genericregulatories.db.dto


data class Constraint(
    val id: Long,
    val complianceRuleId: Long,
    val perspective: CompliancePerspective,
    val predicate : String,
    val operator: String, // TODO change to enum
    val condition: String,
    val leftOperand: ComplianceConcept,
    val rightOperand: ComplianceConcept
)
{
    companion object{
        fun fromRow(id: Long, complianceRuleId: Long, perspective: CompliancePerspective, predicate: String, operator: String, condition: String, leftOperand: ComplianceConcept, rightOperand: ComplianceConcept): Constraint{
            return Constraint(id = id, complianceRuleId = complianceRuleId, perspective = perspective, predicate = predicate, operator = operator, condition = condition, leftOperand = leftOperand, rightOperand = rightOperand)
        }
        internal const val TABLE_NAME = "constraint"
    }
}

enum class CompliancePerspective {
    PERSONAL_DATA,
    SENSITIVE_DATA,
    CONSENT,
    LEGAL_BASIS,
    CUSTOMER,
    EMPLOYEE,
    APPROVAL,
    PROCESSOR,
    CONTROLLER,
    ENCRYPTION,
    RETENTION_PERIOD,
}