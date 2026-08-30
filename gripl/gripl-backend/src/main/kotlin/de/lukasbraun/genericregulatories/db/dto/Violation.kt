package de.lukasbraun.genericregulatories.db.dto

data class Violation(
    val id : Long,
    val complianceRuleId : Long,
    val severity: ComplianceViolationServerity,
    val title: String,
    val message : String?,
    val recommendation: String?,
)
{
    companion object{
        fun fromRow(id: Long, complianceRuleId: Long, severity: ComplianceViolationServerity, title: String, message: String?, recommendation: String?): Violation{
            return Violation(id = id, complianceRuleId = complianceRuleId, severity = severity, title = title, message = message, recommendation = recommendation)
        }
        internal const val TABLE_NAME = "violation"
    }
}

enum class ComplianceViolationServerity {
    LOW,
    MEDIUM,
    HIGH,
}