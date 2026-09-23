"use client"

import {FormEvent, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {ComplianceSeverity} from "@/models/dto/ComplianceRule";

export interface ComplianceRuleFormValues {
    name: string;
    description: string;
    severity: ComplianceSeverity;
}

interface ComplianceRuleFormProps {
    initialValues?: ComplianceRuleFormValues;
    onSubmit: (values: ComplianceRuleFormValues) => Promise<void>;
    onCancel: () => void;
    submitLabel: string;
    pendingLabel: string;
    idPrefix?: string;
}

const emptyValues: ComplianceRuleFormValues = {
    name: "",
    description: "",
    severity: ComplianceSeverity.MEDIUM,
};

export default function ComplianceRuleForm({
    initialValues = emptyValues,
    onSubmit,
    onCancel,
    submitLabel,
    pendingLabel,
    idPrefix = "compliance-rule",
}: ComplianceRuleFormProps) {
    const [values, setValues] = useState(initialValues);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        startTransition(() => onSubmit({
            name: values.name.trim(),
            description: values.description.trim(),
            severity: values.severity,
        }));
    }

    return <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-name`}>Name</Label>
            <Input id={`${idPrefix}-name`} value={values.name} onChange={(event) => setValues({...values, name: event.target.value})} required/>
        </div>
        <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-description`}>Description</Label>
            <Textarea id={`${idPrefix}-description`} value={values.description} onChange={(event) => setValues({...values, description: event.target.value})}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-severity`}>Severity</Label>
            <select
                id={`${idPrefix}-severity`}
                value={values.severity}
                onChange={(event) => setValues({...values, severity: event.target.value as ComplianceSeverity})}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                {Object.values(ComplianceSeverity).map((severity) => <option key={severity} value={severity}>{severity}</option>)}
            </select>
        </div>
        <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? pendingLabel : submitLabel}</Button>
        </div>
    </form>;
}