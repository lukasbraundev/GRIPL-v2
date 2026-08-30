package de.lukasbraun.genericregulatories.db.dto

data class ComplianceConcept(
    val id: Long,
    val name: String,
    val conceptCategory : ComplianceConceptCategory,
)
{
    companion object{
        fun fromRow(id: Long, name: String, conceptCategory: ComplianceConceptCategory): ComplianceConcept{
            return ComplianceConcept(id = id, name = name, conceptCategory = conceptCategory)
        }
        internal const val TABLE_NAME = "compliance_concept"
    }
}

enum class ComplianceConceptCategory {
    PERSONAL_DATA,
    SENSITIVE_DATA,
    CONSENT,
    LEGAL_BASIS,
    CUSTOMER,
}
