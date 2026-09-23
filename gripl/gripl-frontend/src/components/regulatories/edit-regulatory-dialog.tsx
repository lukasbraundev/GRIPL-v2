"use client"

import {useState} from "react";
import {Pencil} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Regulatory} from "@/models/dto/Regulatory";
import updateRegulatory from "@/actions/generic-regulatories/update-regulatory";
import RegulatoryForm, {RegulatoryFormValues} from "@/components/regulatories/regulatory-form";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";

interface EditRegulatoryDialogProps {
    regulatory: Regulatory;
}

export default function EditRegulatoryDialog({regulatory}: EditRegulatoryDialogProps) {
    const [open, setOpen] = useState(false);
    const {showToast, showError} = useToast();

    async function handleSubmit(values: RegulatoryFormValues) {
        try {
            await updateRegulatory(regulatory.id, values.title, values.version, values.authority);
            setOpen(false);
            showToast({title: "Regulatory updated", variant: "success"});
            window.location.reload();
        } catch (error) {
            showError("Failed to update regulatory", toErrorMessage(error));
        }
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <Button
            variant="outline"
            size="icon"
            onClick={() => setOpen(true)}
            aria-label={`Edit ${regulatory.title}`}
            title={`Edit ${regulatory.title}`}
        >
            <Pencil className="h-4 w-4"/>
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit regulatory</DialogTitle>
                <DialogDescription>Update the compliance framework details.</DialogDescription>
            </DialogHeader>
            <RegulatoryForm
                initialValues={{title: regulatory.title, version: regulatory.version, authority: regulatory.authority}}
                idPrefix={`regulatory-${regulatory.id}`}
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                submitLabel="Save changes"
                pendingLabel="Saving..."
            />
        </DialogContent>
    </Dialog>;
}