package de.lukasbraun.genericregulatories.db.dto

data class Exception(
    val id : Long,
    val complianceRuleId : Long,
    val condition: String,
    val description: String,
)
{
    companion object{
        fun fromRow(id: Long, complianceRuleId: Long, condition: String, description: String): Exception{
            return Exception(id = id, complianceRuleId = complianceRuleId, condition = condition, description = description)
        }
        internal const val TABLE_NAME = "exception"
    }
}
