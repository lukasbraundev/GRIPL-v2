"use server"

export default async function deleteRegulatory(regulatoryId: number): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/regulation/${regulatoryId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Failed to delete regulatory: ${response.statusText}`);
    }
}