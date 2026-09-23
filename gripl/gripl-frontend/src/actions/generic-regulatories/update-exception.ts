"use server"

import {ComplianceException} from "@/models/dto/ComplianceException";

export default async function updateException(exception: ComplianceException): Promise<void> {
    const body = new URLSearchParams({
        id: String(exception.id),
        complianceRuleId: String(exception.complianceRuleId),
        condition: exception.condition,
        description: exception.description,
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/exception`, {
        method: "PUT",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body,
    });

    if (!response.ok) throw new Error(`Failed to update exception: ${response.statusText}`);
}