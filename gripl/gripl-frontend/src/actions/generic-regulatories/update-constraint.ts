"use server"

import {Constraint} from "@/models/dto/Constraint";

export default async function updateConstraint(constraint: Constraint): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/constraint/`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(constraint),
    });

    if (!response.ok) throw new Error(`Failed to update constraint: ${response.statusText}`);
}