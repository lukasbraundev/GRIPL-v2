"use server"

export default async function updateComplianceRule(
    id: number,
    regulationId: number,
    name: string,
    description: string,
    severity: string,
): Promise<void> {
    const body = new URLSearchParams({
        id: String(id),
        regulationId: String(regulationId),
        name,
        description,
        severity,
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/compliance-rule/`, {
        method: "PUT",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body,
    });

    if (!response.ok) {
        throw new Error(`Failed to update compliance rule: ${response.statusText}`);
    }
}