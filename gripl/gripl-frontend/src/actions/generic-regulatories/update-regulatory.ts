"use server"

export default async function updateRegulatory(
    id: number,
    title: string,
    version: string,
    authority: string,
): Promise<void> {
    const body = new URLSearchParams({
        id: String(id),
        title,
        version,
        authority,
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/regulation/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    if (!response.ok) {
        throw new Error(`Failed to update regulatory: ${response.statusText}`);
    }
}