"use server";

import {ComplianceRule} from "@/models/dto/ComplianceRule";

export default async function getAllComplianceRules(): Promise<ComplianceRule[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/compliance-rule`, {cache: "no-store"});
    if (!response.ok) throw new Error(`Failed to fetch compliance rules: ${response.statusText}`);
    return response.json();
}
