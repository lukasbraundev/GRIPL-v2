"use client"

import {FormEvent, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {ComplianceConceptCategory, CompliancePerspective, Constraint} from "@/models/dto/Constraint";

export type ConstraintFormValues = Omit<Constraint, "id" | "complianceRuleId">;

interface ConstraintFormProps {
    initialValues?: ConstraintFormValues;
    onSubmit: (values: ConstraintFormValues) => Promise<void>;
    onCancel: () => void;
    submitLabel: string;
    pendingLabel: string;
    idPrefix: string;
}

const emptyValues: ConstraintFormValues = {
    perspective: CompliancePerspective.PERSONAL_DATA,
    predicate: "",
    operator: "",
    condition: "",
    leftOperandName: "",
    leftOperandConcept: ComplianceConceptCategory.PERSONAL_DATA,
    rightOperandName: "",
    rightOperandConcept: ComplianceConceptCategory.PERSONAL_DATA,
};

export default function ConstraintForm({
    initialValues = emptyValues,
    onSubmit,
    onCancel,
    submitLabel,
    pendingLabel,
    idPrefix,
}: ConstraintFormProps) {
    const [values, setValues] = useState(initialValues);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        startTransition(() => onSubmit({
            ...values,
            predicate: values.predicate.trim(),
            operator: values.operator.trim(),
            condition: values.condition.trim(),
            leftOperandName: values.leftOperandName.trim(),
            rightOperandName: values.rightOperandName.trim(),
        }));
    }

    return <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-perspective`}>Perspective</Label>
                <select id={`${idPrefix}-perspective`} value={values.perspective} onChange={(event) => setValues({...values, perspective: event.target.value as CompliancePerspective})} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {Object.values(CompliancePerspective).map((perspective) => <option key={perspective} value={perspective}>{perspective.replaceAll("_", " ")}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-condition`}>Condition</Label>
                <Input id={`${idPrefix}-condition`} value={values.condition} onChange={(event) => setValues({...values, condition: event.target.value})} placeholder="when processing" required/>
            </div>
        </div>
        <div className="grid gap-4 rounded-lg border bg-muted/20 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(10rem,0.8fr)_minmax(0,1fr)] lg:items-start">
            <div className="space-y-3">
                <p className="text-sm font-medium">Left operand</p>
                <Input aria-label="left operand name" value={values.leftOperandName} onChange={(event) => setValues({...values, leftOperandName: event.target.value})} placeholder="Concept name" required/>
                <select aria-label="left operand category" value={values.leftOperandConcept} onChange={(event) => setValues({...values, leftOperandConcept: event.target.value as ComplianceConceptCategory})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {Object.values(ComplianceConceptCategory).map((category) => <option key={category} value={category}>{category.replaceAll("_", " ")}</option>)}
                </select>
            </div>
            <div className="space-y-3">
                <p className="text-sm font-medium">Predicate and operator</p>
                <Input id={`${idPrefix}-predicate`} value={values.predicate} onChange={(event) => setValues({...values, predicate: event.target.value})} placeholder="must contain" required/>
                <Input id={`${idPrefix}-operator`} value={values.operator} onChange={(event) => setValues({...values, operator: event.target.value})} placeholder="EQUALS" required/>
            </div>
            <div className="space-y-3">
                <p className="text-sm font-medium">Right operand</p>
                <Input aria-label="right operand name" value={values.rightOperandName} onChange={(event) => setValues({...values, rightOperandName: event.target.value})} placeholder="Concept name" required/>
                <select aria-label="right operand category" value={values.rightOperandConcept} onChange={(event) => setValues({...values, rightOperandConcept: event.target.value as ComplianceConceptCategory})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {Object.values(ComplianceConceptCategory).map((category) => <option key={category} value={category}>{category.replaceAll("_", " ")}</option>)}
                </select>
            </div>
        </div>
        <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? pendingLabel : submitLabel}</Button>
        </div>
    </form>;
}