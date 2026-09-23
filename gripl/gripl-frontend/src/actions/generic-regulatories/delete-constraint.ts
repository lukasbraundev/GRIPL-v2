"use server"

export default async function deleteConstraint(constraintId: number): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/constraint/delete/${constraintId}`, {
        method: "DELETE",
    });

    if (!response.ok) throw new Error(`Failed to delete constraint: ${response.statusText}`);
}