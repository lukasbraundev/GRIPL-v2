"use server"

import {Constraint} from "@/models/dto/Constraint";

export default async function createConstraint(constraint: Omit<Constraint, "id">): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/constraint/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: 0, ...constraint}),
    });

    if (!response.ok) throw new Error(`Failed to create constraint: ${response.statusText}`);
}