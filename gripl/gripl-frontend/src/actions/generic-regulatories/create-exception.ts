"use server"

import {ComplianceException} from "@/models/dto/ComplianceException";

export default async function createException(exception: Omit<ComplianceException, "id">): Promise<void> {
    const body = new URLSearchParams({
        id: "0",
        complianceRuleId: String(exception.complianceRuleId),
        condition: exception.condition,
        description: exception.description,
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/exception`, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body,
    });

    if (!response.ok) throw new Error(`Failed to create exception: ${response.statusText}`);
}