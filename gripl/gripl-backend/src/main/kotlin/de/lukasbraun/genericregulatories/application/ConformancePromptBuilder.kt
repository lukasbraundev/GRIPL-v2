package de.lukasbraun.genericregulatories.application

import de.mertendieckmann.griplbackend.model.BpmnElement

class ConformancePromptBuilder {
    fun buildConformancePrompt(
        analysisStrategy: String,
        bpmnElements: Set<BpmnElement>
    ): String = buildString {
        appendLine("Apply the following analysis strategy to the BPMN model.")
        appendLine("Return only valid JSON matching the requested schema.")
        appendLine()
        appendLine("=== ANALYSIS STRATEGY ===")
        appendLine(analysisStrategy)
        appendLine()
        appendLine("=== BPMN MODEL ===")
        bpmnElements.forEach { appendLine("- $it") }
        appendLine()
        appendLine("=== OUTPUT REQUIREMENTS ===")
        appendLine("Assess each relevant BPMN element using only evidence present in the model.")
        appendLine("Do not invent element IDs, facts, or regulatory evidence.")
        appendLine("Return this JSON object:")
        appendLine("""{"elements":[{"id":"<exact BPMN element id>","label":null,"reason":"<evidence-based explanation>","isRelevant":true,"complianceRuleIds":[<matching rule IDs>]}]}""")
        appendLine("For each relevant element, complianceRuleIds must contain the IDs of every supplied compliance rule that explains the interference.")
        appendLine("Use an empty complianceRuleIds array only when no supplied rule can be matched.")
        appendLine("Only include elements that are relevant to the regulatory requirements.")
        appendLine("Use an empty elements array when no element is relevant.")
    }
}