"use server"

export default async function deleteComplianceRule(ruleId: number): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/compliance-rule/${ruleId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Failed to delete compliance rule: ${response.statusText}`);
    }
}