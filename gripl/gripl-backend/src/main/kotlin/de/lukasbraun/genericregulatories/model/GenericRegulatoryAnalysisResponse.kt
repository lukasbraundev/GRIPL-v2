package de.lukasbraun.genericregulatories.model

import de.lukasbraun.genericregulatories.db.dto.ComplianceRule
import de.mertendieckmann.griplbackend.application.BpmnExtractor
import de.mertendieckmann.griplbackend.model.BpmnElement

data class GenericRegulatoryAnalysisResponse(
    val criticalElements: List<CriticalElement>
) {
    data class CriticalElement(
        val id: String,
        val name: String?,
        val type: String? = null,
        val reason: String,
        val complianceRules: List<ComplianceRule> = emptyList()
    )

    companion object {
        fun fromAnalysisResult(
            result: GenericRegulatoryAnalysisResult,
            bpmnElements: Set<BpmnElement>,
            complianceRules: List<ComplianceRule>
        ): GenericRegulatoryAnalysisResponse {
            val rulesById = complianceRules.associateBy { it.id }
            return GenericRegulatoryAnalysisResponse(
                criticalElements = result.elements
                    .filter { it.isRelevant }
                    .map { element ->
                        val bpmnElement = bpmnElements.find { it.id == element.id }
                        CriticalElement(
                            id = element.id,
                            name = bpmnElement?.name?.takeIf { it.isNotBlank() }
                                ?: bpmnElement?.derivedNameFromFlows()
                                ?: element.label,
                            type = bpmnElement?.type,
                            reason = element.reason,
                            complianceRules = element.complianceRuleIds.mapNotNull(rulesById::get)
                        )
                    }
            )
        }

        fun fromAnalysisResult(
            result: GenericRegulatoryAnalysisResult,
            bpmnXml: String,
            complianceRules: List<ComplianceRule>
        ): GenericRegulatoryAnalysisResponse =
            fromAnalysisResult(result, BpmnExtractor().extractBpmnElements(bpmnXml), complianceRules)
    }
}
