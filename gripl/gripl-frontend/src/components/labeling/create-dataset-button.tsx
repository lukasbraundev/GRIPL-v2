"use client"

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import React from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {Plus} from "lucide-react";
import createDataset from "@/actions/create-dataset";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";
import {DatasetType} from "@/models/dto/Dataset";
import {Regulatory} from "@/models/dto/Regulatory";

export default function CreateDatasetButton({regulatories}: {regulatories: Regulatory[]}) {

    const router = useRouter()
    const [showCreateDatasetDialog, setShowCreateDatasetDialog] = React.useState(false)
    const [datasetType, setDatasetType] = React.useState<DatasetType>("GDPR")
    const [regulationIds, setRegulationIds] = React.useState<number[]>([])
    const {showToast, showError} = useToast()

    function handleTestCaseCreation() {
        const datasetName = (document.getElementById("dataset-name") as HTMLInputElement).value
        if (!datasetName) {
            showToast({title: "Please enter a name for the dataset.", variant: "info"})
            return
        }
        const datasetDescription = (document.getElementById("dataset-description") as HTMLInputElement).value
        if (datasetType === "GENERIC_REGULATORIES" && regulationIds.length === 0) {
            showToast({title: "Select at least one regulation.", variant: "info"})
            return
        }
        createDataset(datasetName, datasetDescription, datasetType, regulationIds).then().then(id => {
            router.refresh()
            setShowCreateDatasetDialog(false)
        }).catch(error => {
            console.error("There was an error creating the dataset:", error)
            showError("Failed to create the dataset", toErrorMessage(error))
        })
    }

    return <Dialog open={showCreateDatasetDialog} onOpenChange={setShowCreateDatasetDialog}>
        <Button className="h-full" onClick={() => setShowCreateDatasetDialog(true)}>
            <Plus />
            <span className="pl-2 text-center">Create Dataset</span>
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create Dataset</DialogTitle>
                <DialogDescription>Create a new dataset to organize your test cases for different evaluation runs.</DialogDescription>
            </DialogHeader>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="dataset-name">Name</Label>
                        <Input id="dataset-name" placeholder={"name"}/>
                    </div>
                    {datasetType === "GENERIC_REGULATORIES" && <div className="space-y-2 py-2">
                        <Label>Regulations</Label>
                        <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
                            {regulatories.map((regulatory) => <label key={regulatory.id} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={regulationIds.includes(regulatory.id)} onChange={() => setRegulationIds((current) => current.includes(regulatory.id) ? current.filter((id) => id !== regulatory.id) : [...current, regulatory.id])}/>
                                {regulatory.title} ({regulatory.version})
                            </label>)}
                        </div>
                    </div>}
                </div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="dataset-description">Description</Label>
                        <Input id="dataset-description" placeholder={"description"}/>
                    </div>
                </div>
            </div>
            <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                    <Label htmlFor="dataset-type">Dataset type</Label>
                    <select
                        id="dataset-type"
                        value={datasetType}
                        onChange={(event) => setDatasetType(
                            event.target.value === "GENERIC_REGULATORIES" ? "GENERIC_REGULATORIES" : "GDPR"
                        )}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="GDPR">GDPR</option>
                        <option value="GENERIC_REGULATORIES">Generic regulatories</option>
                    </select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDatasetDialog(false)}>
                    Cancel
                </Button>
                <Button type="submit" onClick={handleTestCaseCreation}>Create</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}