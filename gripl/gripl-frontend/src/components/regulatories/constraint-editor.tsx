"use client"

import {useState} from "react";
import {Pencil, Plus, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ConfirmationDialog} from "@/components/ui/confirmation-dialog";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";
import createConstraint from "@/actions/generic-regulatories/create-constraint";
import deleteConstraint from "@/actions/generic-regulatories/delete-constraint";
import updateConstraint from "@/actions/generic-regulatories/update-constraint";
import ConstraintForm, {ConstraintFormValues} from "@/components/regulatories/constraint-form";
import {ComplianceRule} from "@/models/dto/ComplianceRule";
import {Constraint} from "@/models/dto/Constraint";

export default function ConstraintEditor({rule, constraints}: {rule: ComplianceRule; constraints: Constraint[]}) {
    const [dialogConstraint, setDialogConstraint] = useState<Constraint | "new" | null>(null);
    const [constraintToDelete, setConstraintToDelete] = useState<Constraint | null>(null);
    const router = useRouter();
    const {showToast, showError} = useToast();

    async function handleSubmit(values: ConstraintFormValues) {
        try {
            if (dialogConstraint === "new") {
                await createConstraint({...values, complianceRuleId: rule.id});
                showToast({title: "Constraint added", variant: "success"});
            } else if (dialogConstraint) {
                await updateConstraint({...values, id: dialogConstraint.id, complianceRuleId: rule.id});
                showToast({title: "Constraint updated", variant: "success"});
            }
            setDialogConstraint(null);
            if (dialogConstraint === "new") router.refresh();
            else if (dialogConstraint) window.location.reload();
        } catch (error) {
            showError("Failed to save constraint", toErrorMessage(error));
        }
    }

    async function handleDelete() {
        if (!constraintToDelete) return;
        try {
            await deleteConstraint(constraintToDelete.id);
            showToast({title: "Constraint deleted", variant: "success"});
            router.refresh();
        } catch (error) {
            showError("Failed to delete constraint", toErrorMessage(error));
        } finally {
            setConstraintToDelete(null);
        }
    }

    return <>
        <Card>
            <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                    <CardTitle>Constraints</CardTitle>
                    <CardDescription className="mt-1">Model the conditions that make this rule applicable.</CardDescription>
                </div>
                <Button onClick={() => setDialogConstraint("new")}><Plus/>Add constraint</Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {constraints.length === 0 ? <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">No constraints yet. Add one to describe this article’s condition.</div> : constraints.map((constraint) => <div key={constraint.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="min-w-0 space-y-2">
                        <Badge variant="outline">{constraint.perspective.replaceAll("_", " ")}</Badge>
                        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                            <div><p className="text-xs text-muted-foreground">Left operand</p><p className="font-medium">{constraint.leftOperandName}</p></div>
                            <div><p className="text-xs text-muted-foreground">Predicate</p><p className="font-medium">{constraint.predicate}</p></div>
                            <div><p className="text-xs text-muted-foreground">Right operand</p><p className="font-medium">{constraint.rightOperandName}</p></div>
                            <div><p className="text-xs text-muted-foreground">Condition</p><p className="font-medium">{constraint.condition}</p></div>
                        </div>
                        <Badge variant="secondary">{constraint.operator}</Badge>
                    </div>
                    <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setDialogConstraint(constraint)} aria-label="Edit constraint" title="Edit constraint"><Pencil className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => setConstraintToDelete(constraint)} aria-label="Delete constraint" title="Delete constraint"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                </div>)}
            </CardContent>
        </Card>
        <Dialog open={dialogConstraint !== null} onOpenChange={(open) => !open && setDialogConstraint(null)}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{dialogConstraint === "new" ? "Add constraint" : "Edit constraint"}</DialogTitle>
                    <DialogDescription>Define the structured condition for this compliance rule.</DialogDescription>
                </DialogHeader>
                {dialogConstraint && <ConstraintForm
                    initialValues={dialogConstraint === "new" ? undefined : dialogConstraint}
                    idPrefix={`constraint-${dialogConstraint === "new" ? "new" : dialogConstraint.id}`}
                    onSubmit={handleSubmit}
                    onCancel={() => setDialogConstraint(null)}
                    submitLabel={dialogConstraint === "new" ? "Add constraint" : "Save changes"}
                    pendingLabel={dialogConstraint === "new" ? "Adding..." : "Saving..."}
                />}
            </DialogContent>
        </Dialog>
        <ConfirmationDialog
            isOpen={constraintToDelete !== null}
            onClose={() => setConstraintToDelete(null)}
            onConfirm={handleDelete}
            title="Delete constraint"
            description="Are you sure you want to delete this constraint? This action cannot be undone."
            confirmLabel="Delete"
        />
    </>;
}