"use client"

import {FormEvent, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

export interface ExceptionFormValues {
    condition: string;
    description: string;
}

interface ExceptionFormProps {
    initialValues?: ExceptionFormValues;
    onSubmit: (values: ExceptionFormValues) => Promise<void>;
    onCancel: () => void;
    submitLabel: string;
    pendingLabel: string;
    idPrefix: string;
}

const emptyValues: ExceptionFormValues = {condition: "", description: ""};

export default function ExceptionForm({
    initialValues = emptyValues,
    onSubmit,
    onCancel,
    submitLabel,
    pendingLabel,
    idPrefix,
}: ExceptionFormProps) {
    const [values, setValues] = useState(initialValues);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        startTransition(() => onSubmit({
            condition: values.condition.trim(),
            description: values.description.trim(),
        }));
    }

    return <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-condition`}>Condition</Label>
            <Input id={`${idPrefix}-condition`} value={values.condition} onChange={(event) => setValues({...values, condition: event.target.value})} placeholder="Unless the data subject has opted out" required/>
        </div>
        <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-description`}>Description</Label>
            <Textarea id={`${idPrefix}-description`} value={values.description} onChange={(event) => setValues({...values, description: event.target.value})} placeholder="Explain when this exception applies"/>
        </div>
        <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? pendingLabel : submitLabel}</Button>
        </div>
    </form>;
}