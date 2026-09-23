import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import getComplianceRules from "@/actions/generic-regulatories/get-compliance-rules";
import getConstraintsByRule from "@/actions/generic-regulatories/get-constraints-by-rule";
import getExceptionsByRule from "@/actions/generic-regulatories/get-exceptions-by-rule";
import getRegulatories from "@/actions/generic-regulatories/get-regulatories";
import ConstraintEditor from "@/components/regulatories/constraint-editor";
import ExceptionEditor from "@/components/regulatories/exception-editor";
import {Button} from "@/components/ui/button";

export default async function ConstraintEditorPage({params}: {params: Promise<{id: string; ruleId: string}>}) {
    const {id, ruleId} = await params;
    const regulationId = Number(id);
    const complianceRuleId = Number(ruleId);
    const [regulatories, rules, constraints, exceptions] = await Promise.all([
        getRegulatories(),
        Number.isNaN(regulationId) ? Promise.resolve([]) : getComplianceRules(regulationId),
        Number.isNaN(complianceRuleId) ? Promise.resolve([]) : getConstraintsByRule(complianceRuleId),
        Number.isNaN(complianceRuleId) ? Promise.resolve([]) : getExceptionsByRule(complianceRuleId),
    ]);
    const regulatory = regulatories.find((item) => item.id === regulationId);
    const rule = rules.find((item) => item.id === complianceRuleId);

    if (!regulatory || !rule) {
        return <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
            <h1 className="text-2xl font-bold">Compliance rule not found</h1>
            <Button asChild variant="outline"><Link href={`/regulatories/${id}/rules`}><ArrowLeft/>Back to rules</Link></Button>
        </div>;
    }

    return <div className="h-full w-full overflow-y-auto p-6">
        <div className="container mx-auto max-w-6xl">
            <Button asChild variant="ghost" className="mb-6 -ml-3"><Link href={`/regulatories/${regulationId}/rules`}><ArrowLeft/>Back to rules</Link></Button>
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary">{regulatory.title}</p>
                <h1 className="text-3xl font-bold tracking-tight">{rule.name}</h1>
                <p className="mt-2 text-muted-foreground">Edit the constraints and exceptions that describe this compliance rule.</p>
            </div>
            <div className="space-y-6">
                <ConstraintEditor rule={rule} constraints={constraints}/>
                <ExceptionEditor rule={rule} exceptions={exceptions}/>
            </div>
        </div>
    </div>;
}