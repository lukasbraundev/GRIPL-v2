"use client"

import {useState} from "react";
import {Pencil} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ComplianceRule} from "@/models/dto/ComplianceRule";
import updateComplianceRule from "@/actions/generic-regulatories/update-compliance-rule";
import ComplianceRuleForm, {ComplianceRuleFormValues} from "@/components/regulatories/compliance-rule-form";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";

export default function EditComplianceRuleDialog({rule}: {rule: ComplianceRule}) {
    const [open, setOpen] = useState(false);
    const {showToast, showError} = useToast();

    async function handleSubmit(values: ComplianceRuleFormValues) {
        try {
            await updateComplianceRule(rule.id, rule.regulationId, values.name, values.description, values.severity);
            setOpen(false);
            showToast({title: "Compliance rule updated", variant: "success"});
            window.location.reload();
        } catch (error) {
            showError("Failed to update compliance rule", toErrorMessage(error));
        }
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label={`Edit ${rule.name}`} title={`Edit ${rule.name}`}>
            <Pencil className="h-4 w-4"/>
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit compliance rule</DialogTitle>
                <DialogDescription>Update this compliance rule.</DialogDescription>
            </DialogHeader>
            <ComplianceRuleForm
                initialValues={{name: rule.name, description: rule.description ?? "", severity: rule.severity}}
                idPrefix={`compliance-rule-${rule.id}`}
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                submitLabel="Save changes"
                pendingLabel="Saving..."
            />
        </DialogContent>
    </Dialog>;
}