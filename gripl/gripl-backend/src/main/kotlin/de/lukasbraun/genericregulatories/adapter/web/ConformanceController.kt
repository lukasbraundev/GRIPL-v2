package de.lukasbraun.genericregulatories.adapter.web

import de.lukasbraun.genericregulatories.application.RegulatoryConformanceService
import de.mertendieckmann.griplbackend.adapter.web.utils.ControllerUtils
import de.mertendieckmann.griplbackend.config.LlmConfig
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers


@RestController
@RequestMapping("/generic-regulatories/conformance")
@Tag(name = "Generic Regulatories Conformance Controller", description = "Controller for analyzing BPMN XML documents for generic regulatory compliance")
class ConformanceController (
    private val regulatoryConformanceService: RegulatoryConformanceService
){

    @Operation(
        summary = "Analyzes BPMN-XML for generic regulatories",
        description = "Upload a BPMN XML document in the **bpmnXml** file part and the regulatory IDs to apply in the **regulatoryIds** JSON part. The service analyzes the document and returns an analysis report containing generic regulatory-relevant elements found in the BPMN model."
    )
    @PostMapping(
        "/analyze",
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun analyzeBpmnForGenericRegulatories(
        @RequestPart("bpmnXml") bpmnXml: FilePart,
        @RequestPart("regulatoryIds") regulatoryIds: List<Long>,
        @RequestPart("llmProps", required = false) llmPropsOverrides: LlmConfig.Companion.LlmPropsOverride? = null,
    ): Mono<ResponseEntity<AnalysisResponse>> {
        return ControllerUtils.getBpmnXmlMono(bpmnXml)
            .flatMap { bpmnContent ->
                Mono.fromCallable {
                    regulatoryConformanceService.analyzeBpmnForGenericRegulatories(
                        bpmnContent,
                        regulatoryIds,
                        llmPropsOverrides
                    )
                }.subscribeOn(Schedulers.boundedElastic())
            }
            .map { ResponseEntity.ok(it) }
    }
}