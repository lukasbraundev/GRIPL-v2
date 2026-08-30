package de.lukasbraun.genericregulatories.db.dto

// TODO add context
data class ComplianceRule(
    val id: Long,
    val name: String,
    val description: String?,
    val severity: ComplianceSeverity,
    val regulationId: Long
)
{
    companion object{
        fun fromRow(id: Long, name: String, description: String?, severity: ComplianceSeverity, regulationId: Long): ComplianceRule{
            return ComplianceRule(id = id, name = name, description = description, severity = severity, regulationId = regulationId)
        }
        internal const val TABLE_NAME = "compliance_rule"
    }
}

enum class ComplianceSeverity {
    LOW,
    MEDIUM,
    HIGH,
}
