"use client"

import {Search, BookOpenCheck, ListChecks} from "lucide-react";
import Link from "next/link";
import {useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ComplianceRule, ComplianceSeverity} from "@/models/dto/ComplianceRule";
import EditComplianceRuleDialog from "@/components/regulatories/edit-compliance-rule-dialog";
import DeleteComplianceRuleButton from "@/components/regulatories/delete-compliance-rule-button";

interface ComplianceRuleListProps {
    rules: ComplianceRule[];
}

const severityVariant: Record<ComplianceSeverity, "default" | "secondary" | "destructive" | "outline"> = {
    [ComplianceSeverity.LOW]: "secondary",
    [ComplianceSeverity.MEDIUM]: "outline",
    [ComplianceSeverity.HIGH]: "destructive",
};

export default function ComplianceRuleList({rules}: ComplianceRuleListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    if (rules.length === 0) {
        return <Card>
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                    <BookOpenCheck className="h-6 w-6"/>
                </div>
                <h2 className="text-lg font-semibold">No compliance rules yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">This regulation does not have any rules assigned to it.</p>
            </CardContent>
        </Card>;
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredRules = rules.filter((rule) =>
        [rule.name, rule.description ?? "", rule.severity, String(rule.id)]
            .some((value) => value.toLowerCase().includes(normalizedQuery))
    );

    return <Card>
        <CardHeader className="gap-4">
            <div>
                <CardTitle>Compliance rules</CardTitle>
                <CardDescription className="mt-1">Search and manage the rules assigned to this regulation.</CardDescription>
            </div>
            <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search rules"
                    aria-label="Search compliance rules"
                    className="pl-9"
                />
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <div className="hidden border-y bg-muted/30 px-6 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto_auto] md:items-center md:gap-4">
                <span>Rule</span>
                <span>Description</span>
                <span>Severity</span>
                <span className="sr-only">Actions</span>
            </div>
            {filteredRules.length > 0 ? filteredRules.map((rule) =>
                <div key={rule.id} className="grid gap-3 border-t px-4 py-4 first:border-t-0 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto_auto] md:items-center md:gap-4 md:px-6">
                    <div className="min-w-0">
                        <p className="truncate font-medium" title={rule.name}>{rule.name}</p>
                    
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.description || "No description provided"}</p>
                    <Badge className="w-fit" variant={severityVariant[rule.severity] ?? "outline"}>{rule.severity}</Badge>
                    <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label={`Manage constraints for ${rule.name}`} title="Manage constraints">
                            <Link href={`/regulatories/${rule.regulationId}/rules/${rule.id}`}><ListChecks className="h-4 w-4"/></Link>
                        </Button>
                        <EditComplianceRuleDialog rule={rule}/>
                        <DeleteComplianceRuleButton rule={rule}/>
                    </div>
                </div>
            ) : <div className="px-6 py-12 text-center text-sm text-muted-foreground">No compliance rules match your search.</div>}
        </CardContent>
    </Card>;
}