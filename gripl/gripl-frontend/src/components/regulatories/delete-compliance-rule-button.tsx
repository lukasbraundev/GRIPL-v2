"use client"

import {useState} from "react";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ConfirmationDialog} from "@/components/ui/confirmation-dialog";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";
import deleteComplianceRule from "@/actions/generic-regulatories/delete-compliance-rule";
import {ComplianceRule} from "@/models/dto/ComplianceRule";

export default function DeleteComplianceRuleButton({rule}: {rule: ComplianceRule}) {
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const router = useRouter();
    const {showError} = useToast();

    async function handleDeleteConfirm() {
        try {
            await deleteComplianceRule(rule.id);
            router.refresh();
        } catch (error) {
            showError("Failed to delete compliance rule", toErrorMessage(error));
        }
        setIsConfirmDialogOpen(false);
    }

    return <>
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsConfirmDialogOpen(true)}
            aria-label={`Delete ${rule.name}`}
            title={`Delete ${rule.name}`}
        >
            <Trash2 className="h-4 w-4"/>
        </Button>
        <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete compliance rule"
            description={`Are you sure you want to delete ${rule.name}? This action cannot be undone.`}
            confirmLabel="Delete"
        />
    </>;
}