"use client"

import {useState} from "react";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ConfirmationDialog} from "@/components/ui/confirmation-dialog";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";
import deleteRegulatory from "@/actions/generic-regulatories/delete-regulatory";
import {Regulatory} from "@/models/dto/Regulatory";

interface DeleteRegulatoryButtonProps {
    regulatory: Regulatory;
}

export default function DeleteRegulatoryButton({regulatory}: DeleteRegulatoryButtonProps) {
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const router = useRouter();
    const {showError} = useToast();

    async function handleDeleteConfirm() {
        try {
            await deleteRegulatory(regulatory.id);
            router.refresh();
        } catch (error) {
            showError("Failed to delete the regulatory", toErrorMessage(error));
        }
        setIsConfirmDialogOpen(false);
    }

    return <>
        <Button
            variant="outline"
            size="icon"
            onClick={() => setIsConfirmDialogOpen(true)}
            aria-label={`Delete ${regulatory.title}`}
            title={`Delete ${regulatory.title}`}
        >
            <Trash2 className="h-4 w-4"/>
        </Button>
        <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete regulatory"
            description={`Are you sure you want to delete ${regulatory.title}? This action cannot be undone.`}
            confirmLabel="Delete"
        />
    </>;
}