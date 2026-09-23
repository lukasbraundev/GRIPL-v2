"use server"

export default async function createRegulatory(
    title: string,
    version: string,
    authority: string,
): Promise<void> {
    const body = new URLSearchParams({
        id: "0",
        title,
        version,
        authority,
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/regulation/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    if (!response.ok) {
        throw new Error(`Failed to create regulatory: ${response.statusText}`);
    }
}