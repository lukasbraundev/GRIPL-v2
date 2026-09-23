"use client"

import {useState} from "react";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import createRegulatory from "@/actions/generic-regulatories/create-regulatory";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";
import RegulatoryForm, {RegulatoryFormValues} from "@/components/regulatories/regulatory-form";

export default function CreateRegulatoryButton() {
    const [open, setOpen] = useState(false);
    const {showToast, showError} = useToast();

    async function handleSubmit(values: RegulatoryFormValues) {
        try {
            await createRegulatory(values.title, values.version, values.authority);
            setOpen(false);
            showToast({title: "Regulatory added", variant: "success"});
            window.location.reload();
        } catch (error) {
            showError("Failed to add regulatory", toErrorMessage(error));
        }
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(true)}>
            <Plus/>
            Add regulatory
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add regulatory</DialogTitle>
                <DialogDescription>Add a framework that can be used in process analysis.</DialogDescription>
            </DialogHeader>
            <RegulatoryForm
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                submitLabel="Add regulatory"
                pendingLabel="Adding..."
            />
        </DialogContent>
    </Dialog>;
}