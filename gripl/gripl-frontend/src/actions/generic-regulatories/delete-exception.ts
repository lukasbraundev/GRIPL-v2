"use server"

export default async function deleteException(exceptionId: number): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/exception/${exceptionId}`, {
        method: "DELETE",
    });

    if (!response.ok) throw new Error(`Failed to delete exception: ${response.statusText}`);
}