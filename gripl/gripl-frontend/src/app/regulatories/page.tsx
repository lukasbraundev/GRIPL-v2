import getRegulatories from "@/actions/generic-regulatories/get-regulatories";
import getComplianceRules from "@/actions/generic-regulatories/get-compliance-rules";
import getConstraintsByRule from "@/actions/generic-regulatories/get-constraints-by-rule";
import getExceptionsByRule from "@/actions/generic-regulatories/get-exceptions-by-rule";
import CreateRegulatoryButton from "@/components/regulatories/create-regulatory-button";
import RegulatoryImportExport from "@/components/regulatories/regulatory-import-export";
import RegulatoryList from "@/components/regulatories/regulatory-list";

export default async function RegulatoriesPage() {
    const regulatories = await getRegulatories();
    const exportData = await Promise.all(regulatories.map(async (regulatory) => {
        const rules = await getComplianceRules(regulatory.id);
        const rulesWithDetails = await Promise.all(rules.map(async (rule) => {
            const [constraints, exceptions] = await Promise.all([
                getConstraintsByRule(rule.id),
                getExceptionsByRule(rule.id),
            ]);
            return {...rule, constraints, exceptions};
        }));
        return {...regulatory, rules: rulesWithDetails};
    }));

    return <div className="h-full w-full overflow-y-auto p-6">
        <div className="container mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary">Compliance library</p>
                    <h1 className="text-3xl font-bold tracking-tight">Regulatories</h1>
                    <p className="mt-2 text-muted-foreground">Manage the frameworks used to assess your business processes.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <RegulatoryImportExport showExport={false}/>
                    <CreateRegulatoryButton/>
                </div>
            </div>
            <RegulatoryList regulatories={regulatories} exportData={exportData}/>
        </div>
    </div>;
}