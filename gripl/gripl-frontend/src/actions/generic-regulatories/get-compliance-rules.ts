"use server"

import {ComplianceRule} from "@/models/dto/ComplianceRule";

export default async function getComplianceRules(regulationId: number): Promise<ComplianceRule[]> {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/compliance-rule/regulation/${regulationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch compliance rules: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("There was an error fetching the compliance rules:", error);
            return [];
        });

    return result as ComplianceRule[];
}