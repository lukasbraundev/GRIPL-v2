"use client"

import {FormEvent, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export interface RegulatoryFormValues {
    title: string;
    version: string;
    authority: string;
}

interface RegulatoryFormProps {
    initialValues?: RegulatoryFormValues;
    onSubmit: (values: RegulatoryFormValues) => Promise<void>;
    onCancel: () => void;
    submitLabel: string;
    pendingLabel: string;
    idPrefix?: string;
    className?: string;
}

const emptyValues: RegulatoryFormValues = {
    title: "",
    version: "",
    authority: "",
};

export default function RegulatoryForm({
    initialValues = emptyValues,
    onSubmit,
    onCancel,
    submitLabel,
    pendingLabel,
    idPrefix = "regulatory",
    className,
}: RegulatoryFormProps) {
    const [values, setValues] = useState<RegulatoryFormValues>(initialValues);
    const [isPending, startTransition] = useTransition();

    function updateValue(field: keyof RegulatoryFormValues, value: string) {
        setValues((current) => ({...current, [field]: value}));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        startTransition(() => onSubmit({
            title: values.title.trim(),
            version: values.version.trim(),
            authority: values.authority.trim(),
        }));
    }

    return <form onSubmit={handleSubmit} className={`space-y-4 ${className ?? ""}`}>
        <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-title`}>Title</Label>
            <Input id={`${idPrefix}-title`} value={values.title} onChange={(event) => updateValue("title", event.target.value)} placeholder="General Data Protection Regulation" required/>
        </div>
        <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-version`}>Version</Label>
            <Input id={`${idPrefix}-version`} value={values.version} onChange={(event) => updateValue("version", event.target.value)} placeholder="2016/679" required/>
        </div>
        <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-authority`}>Authority</Label>
            <Input id={`${idPrefix}-authority`} value={values.authority} onChange={(event) => updateValue("authority", event.target.value)} placeholder="European Union" required/>
        </div>
        <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? pendingLabel : submitLabel}</Button>
        </div>
    </form>;
}