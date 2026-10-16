"use server"

import {DatasetType} from "@/models/dto/Dataset";

export default async function updateDataset(id: number, name: string, description: string, type: DatasetType, regulationIds: number[]): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dataset/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, description, type, regulationIds}),
    });
    if (!response.ok) throw new Error(`Failed to update dataset: ${response.statusText}`);
}
