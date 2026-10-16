package de.mertendieckmann.griplbackend.evaluation.service

import tools.jackson.module.kotlin.jacksonObjectMapper
import tools.jackson.module.kotlin.readValue
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import de.mertendieckmann.griplbackend.model.dto.EvaluationRequest
import de.mertendieckmann.griplbackend.model.dto.ExpectedValue
import de.lukasbraun.genericregulatories.model.GenericRegulatoryAnalysisResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.MediaType
import org.springframework.http.client.MultipartBodyBuilder
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException
import org.springframework.web.reactive.function.client.awaitBody

@Service
class HttpEvaluator(
    @Value("\${server.port:8080}") private val serverPort: Int,
): Evaluator {

    private val webClient = WebClient.builder()
        .codecs { it.defaultCodecs().maxInMemorySize(32 * 1024 * 1024) }
        .build()

    override suspend fun evaluate(bpmnXml: String, evaluationRequest: EvaluationRequest): EvaluationCallResult {
        val bodyBuilder = MultipartBodyBuilder()
        val isConformanceEndpoint = evaluationRequest.evaluationEndpoint.contains("/generic-regulatories/conformance/")
        val bpmnPartName = if (isConformanceEndpoint) "bpmnXml" else "bpmnFile"
        bodyBuilder.part(bpmnPartName, ByteArrayResource(bpmnXml.toByteArray()))
            .header("Content-Disposition", "form-data; name=\"$bpmnPartName\"; filename=\"process.bpmn\"")
            .contentType(MediaType.APPLICATION_XML)
        if (isConformanceEndpoint) {
            bodyBuilder.part("regulatoryIds", jacksonObjectMapper().writeValueAsString(evaluationRequest.regulatoryIds))
                .header("Content-Disposition", "form-data; name=\"regulatoryIds\"")
                .contentType(MediaType.APPLICATION_JSON)
        }
        evaluationRequest.llmProps?.let { overrides ->
            bodyBuilder.part("llmProps", jacksonObjectMapper().writeValueAsString(overrides))
                .header("Content-Disposition", "form-data; name=\"llmProps\"")
                .contentType(MediaType.APPLICATION_JSON)
        }
        // Forward RAG parameters — the analysis endpoint defaults to false/hybrid when omitted,
        // but we send them explicitly so behaviour matches the evaluation request config.
        bodyBuilder.part("useRag", evaluationRequest.useRag.toString())
        bodyBuilder.part("ragMode", evaluationRequest.ragMode.toString())
        bodyBuilder.part("activitiesOnly", evaluationRequest.activitiesOnly.toString())

        val absoluteEndpoint = if (evaluationRequest.evaluationEndpoint.startsWith("http://") || evaluationRequest.evaluationEndpoint.startsWith("https://")) {
            evaluationRequest.evaluationEndpoint
        } else {
            "http://localhost:$serverPort${evaluationRequest.evaluationEndpoint}"
        }

        try {
            val responseBody: String = webClient
                .post()
                .uri(absoluteEndpoint)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                .retrieve()
                .awaitBody()
            val analysisResponse = if (isConformanceEndpoint) {
                val conformanceResponse = jacksonObjectMapper()
                    .readValue<GenericRegulatoryAnalysisResponse>(responseBody)
                AnalysisResponse(
                    criticalElements = conformanceResponse.criticalElements.map {
                        AnalysisResponse.CriticalElement(
                            id = it.id,
                            name = it.name,
                            type = it.type,
                            reason = it.reason
                        )
                    }
                )
            } else {
                jacksonObjectMapper().readValue<AnalysisResponse>(responseBody)
            }

            return EvaluationCallResult(
                expectedValues = analysisResponse.criticalElements.map {
                    ExpectedValue(value = it.id, reason = it.reason)
                },
                amountOfRetries = analysisResponse.amountOfRetries,
                analysisResponse = analysisResponse
            )
        } catch (e: WebClientResponseException) {
            throw RuntimeException("Failed to evaluate BPMN XML at endpoint '$absoluteEndpoint': ${e.responseBodyAsString}", e)
        }
    }
}
