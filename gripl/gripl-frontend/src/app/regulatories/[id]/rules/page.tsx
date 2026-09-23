import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import getComplianceRules from "@/actions/generic-regulatories/get-compliance-rules";
import getRegulatories from "@/actions/generic-regulatories/get-regulatories";
import ComplianceRuleList from "@/components/regulatories/compliance-rule-list";
import {Button} from "@/components/ui/button";
import CreateComplianceRuleButton from "@/components/regulatories/create-compliance-rule-button";

export default async function ComplianceRulesPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const regulationId = Number(id);
    const [regulatories, rules] = await Promise.all([
        getRegulatories(),
        Number.isNaN(regulationId) ? Promise.resolve([]) : getComplianceRules(regulationId),
    ]);
    const regulatory = regulatories.find((item) => item.id === regulationId);

    if (!regulatory) {
        return <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
            <h1 className="text-2xl font-bold">Regulatory not found</h1>
            <Button asChild variant="outline">
                <Link href="/regulatories"><ArrowLeft/>Back to regulatories</Link>
            </Button>
        </div>;
    }

    return <div className="h-full w-full overflow-y-auto p-6">
        <div className="container mx-auto max-w-6xl">
            <Button asChild variant="ghost" className="mb-6 -ml-3">
                <Link href="/regulatories"><ArrowLeft/>Back to regulatories</Link>
            </Button>
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary">{regulatory.authority}</p>
                    <h1 className="text-3xl font-bold tracking-tight">{regulatory.title}</h1>
                    <p className="mt-2 text-muted-foreground">Compliance rules for version {regulatory.version}.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <CreateComplianceRuleButton regulationId={regulationId}/>
                </div>
            </div>
            <ComplianceRuleList rules={rules}/>
        </div>
    </div>;
}