package de.lukasbraun.genericregulatories.model

import de.mertendieckmann.griplbackend.model.BpmnElement

data class GenericRegulatoryAnalysisResult(
    val elements: List<Element>
) {
    data class Element(
        val id: String,
        val label: String? = null,
        val reason: String,
        val isRelevant: Boolean = true,
        val complianceRuleIds: List<Long> = emptyList()
    )

    fun resolveActivities(actualBpmnElements: Set<BpmnElement>): GenericRegulatoryAnalysisResult {
        val existingElementIds = actualBpmnElements
            .filterNot { it.type == "textAnnotation" }
            .map { it.id }
            .toSet()
        return copy(
            elements = elements.mapNotNull { element ->
                val exactMatch = element.id.takeIf { it in existingElementIds }
                val prefixMatch = existingElementIds.filter { it.startsWith(element.id) }.singleOrNull()
                val substringMatch = existingElementIds.filter { it.contains(element.id) }.singleOrNull()
                val resolvedId = exactMatch ?: prefixMatch ?: substringMatch
                resolvedId?.let { element.copy(id = it) }
            }.distinctBy { it.id }
        )
    }
}
