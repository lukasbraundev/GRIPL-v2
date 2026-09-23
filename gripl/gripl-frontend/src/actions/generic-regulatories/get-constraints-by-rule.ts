"use server"

import {Constraint} from "@/models/dto/Constraint";

export default async function getConstraintsByRule(ruleId: number): Promise<Constraint[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/constraint/byComplianceRule/${ruleId}`, {
        cache: "no-store",
    });

    if (response.status === 404) return [];
    if (!response.ok) throw new Error(`Failed to load constraints: ${response.statusText}`);
    return await response.json() as Constraint[];
}