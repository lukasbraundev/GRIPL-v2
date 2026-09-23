"use client"

import {useState} from "react";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";
import createComplianceRule from "@/actions/generic-regulatories/create-compliance-rule";
import ComplianceRuleForm, {ComplianceRuleFormValues} from "@/components/regulatories/compliance-rule-form";

export default function CreateComplianceRuleButton({regulationId}: {regulationId: number}) {
    const [open, setOpen] = useState(false);
    const {showToast, showError} = useToast();

    async function handleSubmit(values: ComplianceRuleFormValues) {
        try {
            await createComplianceRule(regulationId, values.name, values.description, values.severity);
            setOpen(false);
            showToast({title: "Compliance rule added", variant: "success"});
            window.location.reload();
        } catch (error) {
            showError("Failed to add compliance rule", toErrorMessage(error));
        }
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(true)}><Plus/>Add rule</Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add compliance rule</DialogTitle>
                <DialogDescription>Add a rule to this regulatory framework.</DialogDescription>
            </DialogHeader>
            <ComplianceRuleForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} submitLabel="Add rule" pendingLabel="Adding..."/>
        </DialogContent>
    </Dialog>;
}