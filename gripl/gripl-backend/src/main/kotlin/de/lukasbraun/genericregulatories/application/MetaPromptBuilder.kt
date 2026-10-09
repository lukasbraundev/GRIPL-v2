package de.lukasbraun.genericregulatories.application

import de.mertendieckmann.griplbackend.model.BpmnElement
import dev.langchain4j.model.chat.ChatModel

class MetaPromptBuilder {
    fun buildAnalysisStrategy(
        chatModel: ChatModel,
        regulations: List<String>,
        bpmnElements: Set<BpmnElement>
    ): String {
        val metaPrompt = buildString {
            appendLine("You are the strategy designer for a BPMN regulatory-conformance analysis.")
            appendLine("This is the first prompt in a two-stage process.")
            appendLine("Do not produce the final conformance result. Instead, develop a precise analysis strategy")
            appendLine("that a second prompt can apply to the BPMN model.")
            appendLine()
            appendLine("Your strategy must:")
            appendLine("1. Identify which regulatory requirements are relevant to the BPMN model.")
            appendLine("2. Explain which BPMN element properties and relationships must be examined.")
            appendLine("3. Define how each requirement should be evaluated and what evidence is needed.")
            appendLine("4. Distinguish clearly between compliant, non-compliant, and indeterminate evidence.")
            appendLine("5. Require evidence-based conclusions and prohibit invented BPMN facts.")
            appendLine()
            appendLine("Regulatory requirements:")
            regulations.forEachIndexed { index, regulation ->
                appendLine("${index + 1}. $regulation")
            }
            appendLine()
            appendLine("BPMN model elements available to the analysis:")
            bpmnElements.forEach { element ->
                appendLine("- $element")
            }
            appendLine()
            appendLine("Return only the reusable analysis strategy in clear, structured text.")
        }

        return chatModel.chat(metaPrompt)
    }
}