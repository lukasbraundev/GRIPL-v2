"use server"

import { Regulatory } from "@/models/dto/Regulatory";

export default async function getRegulatories(): Promise<Regulatory[]> {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/regulation/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store"
    })
        .then(data => {
            if (!data.ok) {
                console.error(`Failed to fetch regulatories: ${data.statusText}`);
                throw new Error(`Failed to fetch regulatories: ${data.statusText}`);
            }
            return data.json()
        })
        .catch(error => {
            console.error("There was an error fetching the regulatories:", error);
            return []
        })

    return result as Regulatory[];
}