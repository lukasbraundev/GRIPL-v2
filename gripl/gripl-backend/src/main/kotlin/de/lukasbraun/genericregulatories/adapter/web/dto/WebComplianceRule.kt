package de.lukasbraun.genericregulatories.adapter.web.dto

class WebComplianceRule (
    val id: Long,
    val regulationId: Long,
    // TODO Context
    val name : String,
    val description : String?,
    val constraints : List<WebComlianceConstraint>?

)
{
    companion object {

    }
}

class WebComlianceConstraint(
    val id : Long,
    val perspective : String,
    val predicate : String,
    val operator : String,
    val condition : String,
    val leftOperand : WebComplianceConcept,
    val rightOperand : WebComplianceConcept,
)

class WebComplianceConcept(
    val name : String,
    val conceptCategory : String,
)