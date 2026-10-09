package de.lukasbraun.genericregulatories.application

import de.mertendieckmann.griplbackend.adapter.web.utils.ControllerUtils
import de.mertendieckmann.griplbackend.application.BpmnExtractor
import de.mertendieckmann.griplbackend.config.LlmConfig
import de.lukasbraun.genericregulatories.model.GenericRegulatoryAnalysisResponse
import de.lukasbraun.genericregulatories.model.GenericRegulatoryAnalysisResult
import io.github.oshai.kotlinlogging.KLogger
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.core.env.Environment
import org.springframework.stereotype.Service
import tools.jackson.module.kotlin.jacksonObjectMapper
import tools.jackson.module.kotlin.readValue

@Service
class RegulatoryConformanceService (
    private val regulatoryExtractor: RegulatoryExtractor,
    private val env: Environment,
    private val llmConfig: LlmConfig,
    private val log: KLogger = KotlinLogging.logger {}
){

    /**
     * Analyzes a BPMN XML file for generic regulatory compliance.
     *
     * @param bpmnXml The BPMN XML content as a string.
     * @param regulatoryIds A list of regulatory IDs to check against.
     * @param llmPropsOverrides Optional overrides for the LLM properties.
     * @return An analysis report containing generic regulatory-relevant elements.
     */
    public fun analyzeBpmnForGenericRegulatories(bpmnXml: String, regulatoryIds: List<Long>, llmPropsOverrides: LlmConfig.Companion.LlmPropsOverride?): GenericRegulatoryAnalysisResponse {

        // parse the BPMN XML and extract elements
        val bpmnElements = BpmnExtractor().extractBpmnElements(bpmnXml)

        // get all regulations from the database that match the provided regulatoryIds
        val regulations = regulatoryExtractor.extractRegulatoryElements(regulatoryIds)
        val complianceRules = regulatoryExtractor.extractComplianceRules(regulatoryIds)
        log.info { "Extracted regulations: ${regulations.count()}" }

        // generate AIChatModel
        log.info { "Building AIChatModel with resolved LLM properties overrides: $llmPropsOverrides" }
        val resolvedLlmPropsOverride = ControllerUtils.resolveEnvironmentVariables(llmPropsOverrides, env)
        val chatModel = llmConfig.buildStrictJsonModelWithOverride(resolvedLlmPropsOverride)

        // generate the meta prompt
        val analysisStrategy = MetaPromptBuilder().buildAnalysisStrategy(chatModel, regulations, bpmnElements)
        log.info { "Generated analysis strategy" }

        // build and execute the conformance prompt using the generated strategy
        val conformancePrompt = ConformancePromptBuilder()
            .buildConformancePrompt(analysisStrategy, bpmnElements)

        log.info { "Build Conformance Prompt, sending to LLM for analysis" }

        val analysisResult = jacksonObjectMapper().readValue<GenericRegulatoryAnalysisResult>(
            chatModel.chat(conformancePrompt)
        ).resolveActivities(bpmnElements)

        log.info { "Analysis completed, returning result" }
        val analysisResponse = GenericRegulatoryAnalysisResponse.fromAnalysisResult(
            result = analysisResult,
            bpmnElements = bpmnElements,
            complianceRules = complianceRules
        )

        log.info {
            """
            Analysis completed:
            ${jacksonObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(analysisResponse)}
            """.trimIndent()
        }

        return analysisResponse

    }
}