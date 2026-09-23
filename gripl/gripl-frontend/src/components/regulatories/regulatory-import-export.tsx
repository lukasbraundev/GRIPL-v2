"use client"

import {ChangeEvent, useRef, useState} from "react";
import {Download, Upload} from "lucide-react";
import createComplianceRule from "@/actions/generic-regulatories/create-compliance-rule";
import createConstraint from "@/actions/generic-regulatories/create-constraint";
import createException from "@/actions/generic-regulatories/create-exception";
import createRegulatory from "@/actions/generic-regulatories/create-regulatory";
import getComplianceRules from "@/actions/generic-regulatories/get-compliance-rules";
import getConstraintsByRule from "@/actions/generic-regulatories/get-constraints-by-rule";
import getExceptionsByRule from "@/actions/generic-regulatories/get-exceptions-by-rule";
import getRegulatories from "@/actions/generic-regulatories/get-regulatories";
import {ComplianceException} from "@/models/dto/ComplianceException";
import {ComplianceRule} from "@/models/dto/ComplianceRule";
import {Constraint} from "@/models/dto/Constraint";
import {Regulatory} from "@/models/dto/Regulatory";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";

interface RegulatoryImportExportProps {
    regulatory?: Regulatory;
    exportData?: RegulatoryExport;
    showImport?: boolean;
    showExport?: boolean;
    exportIconOnly?: boolean;
}

type RuleExport = ComplianceRule & {
    constraints: Constraint[];
    exceptions: ComplianceException[];
};

export type RegulatoryExport = Regulatory & {rules: RuleExport[]};

function isRegulatory(value: unknown): value is RegulatoryExport {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return typeof candidate.title === "string"
        && typeof candidate.version === "string"
        && typeof candidate.authority === "string"
        && Array.isArray(candidate.rules);
}

async function findCreatedId<T extends {id: number}>(load: () => Promise<T[]>, existingIds: Set<number>, message: string): Promise<number> {
    const created = (await load()).find((item) => !existingIds.has(item.id));
    if (!created) throw new Error(message);
    return created.id;
}

export default function RegulatoryImportExport({regulatory, exportData, showImport = true, showExport = true, exportIconOnly = false}: RegulatoryImportExportProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);
    const {showToast, showError} = useToast();

    function handleExport() {
        if (!regulatory || !exportData) return;
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${regulatory.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "regulatory"}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    async function handleImport(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        setIsImporting(true);
        try {
            const parsed: unknown = JSON.parse(await file.text());
            if (!isRegulatory(parsed)) {
                throw new Error("The JSON must contain one regulatory object with title, version, and authority.");
            }

            const existingRegulatories = await getRegulatories();
            await createRegulatory(parsed.title, parsed.version, parsed.authority);
            const regulatoryId = await findCreatedId(
                getRegulatories,
                new Set(existingRegulatories.map((item) => item.id)),
                "The regulatory framework was created, but its new ID could not be determined.",
            );

            for (const rule of parsed.rules) {
                const existingRules = await getComplianceRules(regulatoryId);
                await createComplianceRule(regulatoryId, rule.name, rule.description ?? "", rule.severity);
                const ruleId = await findCreatedId(
                    () => getComplianceRules(regulatoryId),
                    new Set(existingRules.map((item) => item.id)),
                    `The rule "${rule.name}" was created, but its new ID could not be determined.`,
                );

                for (const constraint of rule.constraints) {
                    const {id: _constraintId, complianceRuleId: _sourceConstraintRuleId, ...constraintData} = constraint;
                    await createConstraint({...constraintData, complianceRuleId: ruleId});
                }
                for (const exception of rule.exceptions) {
                    const {id: _exceptionId, complianceRuleId: _sourceExceptionRuleId, ...exceptionData} = exception;
                    await createException({...exceptionData, complianceRuleId: ruleId});
                }
            }
            showToast({title: "Regulation imported", variant: "success"});
            window.location.reload();
        } catch (error) {
            showError("Failed to import regulation", toErrorMessage(error));
        } finally {
            setIsImporting(false);
        }
    }

    return <div className="flex gap-2">
        {showImport && <>
            <input ref={inputRef} type="file" accept="application/json,.json" onChange={handleImport} className="hidden"/>
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isImporting}>
                <Upload/>{isImporting ? "Importing..." : "Import JSON"}
            </Button>
        </>}
        {showExport && <Button type="button" variant="outline" size={exportIconOnly ? "icon" : "default"} onClick={handleExport} disabled={!regulatory || !exportData} aria-label={exportIconOnly ? `Export ${regulatory?.title ?? "regulation"} as JSON` : undefined} title={exportIconOnly ? "Export JSON" : undefined}>
            <Download/>{!exportIconOnly && "Export JSON"}
        </Button>}
    </div>;
}
