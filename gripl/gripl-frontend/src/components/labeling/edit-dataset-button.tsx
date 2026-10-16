"use client"

import React from "react";
import {Pencil} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Dataset, DatasetType} from "@/models/dto/Dataset";
import {Regulatory} from "@/models/dto/Regulatory";
import updateDataset from "@/actions/update-dataset";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";

export default function EditDatasetButton({dataset, regulatories}: {dataset: Dataset; regulatories: Regulatory[]}) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(dataset.name);
    const [description, setDescription] = React.useState(dataset.description ?? "");
    const [type, setType] = React.useState<DatasetType>(dataset.type);
    const [regulationIds, setRegulationIds] = React.useState<number[]>(dataset.regulationIds ?? []);
    const {showToast, showError} = useToast();

    async function save() {
        if (!name.trim() || (type === "GENERIC_REGULATORIES" && regulationIds.length === 0)) {
            showToast({title: "Enter a name and select at least one regulation for generic datasets.", variant: "info"});
            return;
        }
        try {
            await updateDataset(dataset.id, name.trim(), description.trim(), type, type === "GENERIC_REGULATORIES" ? regulationIds : []);
            setOpen(false);
            window.location.reload();
        } catch (error) {
            showError("Failed to update dataset", toErrorMessage(error));
        }
    }

    function openEditor(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(true);
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <Button
            type="button"
            variant="outline"
            className="h-9"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={openEditor}
            aria-label={`Edit ${dataset.name}`}
            title={`Edit ${dataset.name}`}
        >
            <Pencil className="h-4 w-4"/>
            <span>Edit Dataset</span>
        </Button>
        <DialogContent>
            <DialogHeader><DialogTitle>Edit dataset</DialogTitle></DialogHeader>
            <div className="space-y-4">
                <div><Label>Name</Label><Input value={name} onChange={(event) => setName(event.target.value)}/></div>
                <div><Label>Description</Label><Input value={description} onChange={(event) => setDescription(event.target.value)}/></div>
                <div><Label>Dataset type</Label><select value={type} onChange={(event) => setType(event.target.value as DatasetType)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="GDPR">GDPR</option><option value="GENERIC_REGULATORIES">Generic regulatories</option></select></div>
                {type === "GENERIC_REGULATORIES" && <div><Label>Regulations</Label><div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">{regulatories.map((regulatory) => <label key={regulatory.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={regulationIds.includes(regulatory.id)} onChange={() => setRegulationIds((current) => current.includes(regulatory.id) ? current.filter((id) => id !== regulatory.id) : [...current, regulatory.id])}/>{regulatory.title} ({regulatory.version})</label>)}</div></div>}
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save changes</Button></DialogFooter>
        </DialogContent>
    </Dialog>;
}
