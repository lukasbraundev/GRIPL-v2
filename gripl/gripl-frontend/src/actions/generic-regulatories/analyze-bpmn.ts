"use server"

import {LlmPropsOverride} from "@/models/dto/MultiEvaluationRequest";
import {GenericRegulatoryAnalysisResponse} from "@/models/dto/AnalysisDto";
import {extractErrorDetails} from "@/lib/http-error";

export default async function analyzeBpmnForGenericRegulatories(
    bpmnXml: string,
    regulatoryIds: number[],
    llmProps: LlmPropsOverride,
): Promise<GenericRegulatoryAnalysisResponse> {
    const formData = new FormData();
    formData.append("bpmnXml", new Blob([bpmnXml], {type: "application/xml"}), "diagram.bpmn");
    formData.append(
        "regulatoryIds",
        new Blob([JSON.stringify(regulatoryIds)], {type: "application/json"}),
    );
    formData.append(
        "llmProps",
        new Blob([JSON.stringify(llmProps)], {type: "application/json"}),
    );

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/generic-regulatories/conformance/analyze`,
        {
            method: "POST",
            body: formData,
        },
    );

    if (!response.ok) {
        throw new Error(await extractErrorDetails(response));
    }

    return response.json();
}
