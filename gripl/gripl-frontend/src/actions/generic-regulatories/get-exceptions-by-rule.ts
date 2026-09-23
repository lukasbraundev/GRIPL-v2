"use server"

import {ComplianceException} from "@/models/dto/ComplianceException";

export default async function getExceptionsByRule(ruleId: number): Promise<ComplianceException[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/exception/byComplianceRule/${ruleId}`, {
        cache: "no-store",
    });

    if (response.status === 404) return [];
    if (!response.ok) throw new Error(`Failed to load exceptions: ${response.statusText}`);
    return await response.json() as ComplianceException[];
}