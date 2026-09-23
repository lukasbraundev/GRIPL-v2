"use client"

import {useState} from "react";
import {Pencil, Plus, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ConfirmationDialog} from "@/components/ui/confirmation-dialog";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";
import createException from "@/actions/generic-regulatories/create-exception";
import deleteException from "@/actions/generic-regulatories/delete-exception";
import updateException from "@/actions/generic-regulatories/update-exception";
import ExceptionForm, {ExceptionFormValues} from "@/components/regulatories/exception-form";
import {ComplianceException} from "@/models/dto/ComplianceException";
import {ComplianceRule} from "@/models/dto/ComplianceRule";

export default function ExceptionEditor({rule, exceptions}: {rule: ComplianceRule; exceptions: ComplianceException[]}) {
    const [dialogException, setDialogException] = useState<ComplianceException | "new" | null>(null);
    const [exceptionToDelete, setExceptionToDelete] = useState<ComplianceException | null>(null);
    const router = useRouter();
    const {showToast, showError} = useToast();

    async function handleSubmit(values: ExceptionFormValues) {
        try {
            if (dialogException === "new") {
                await createException({...values, complianceRuleId: rule.id});
                showToast({title: "Exception added", variant: "success"});
            } else if (dialogException) {
                await updateException({...values, id: dialogException.id, complianceRuleId: rule.id});
                showToast({title: "Exception updated", variant: "success"});
            }
            setDialogException(null);
            if (dialogException === "new") router.refresh();
            else if (dialogException) window.location.reload();
        } catch (error) {
            showError("Failed to save exception", toErrorMessage(error));
        }
    }

    async function handleDelete() {
        if (!exceptionToDelete) return;
        try {
            await deleteException(exceptionToDelete.id);
            showToast({title: "Exception deleted", variant: "success"});
            router.refresh();
        } catch (error) {
            showError("Failed to delete exception", toErrorMessage(error));
        } finally {
            setExceptionToDelete(null);
        }
    }

    return <>
        <Card>
            <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                    <CardTitle>Exceptions</CardTitle>
                    <CardDescription className="mt-1">Record situations where this compliance rule does not apply.</CardDescription>
                </div>
                <Button onClick={() => setDialogException("new")}><Plus/>Add exception</Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {exceptions.length === 0 ? <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">No exceptions yet. Add one when this rule has a defined exclusion.</div> : exceptions.map((exception) => <div key={exception.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="min-w-0 space-y-2">
                        <p className="font-medium">{exception.condition}</p>
                        <p className="text-sm text-muted-foreground">{exception.description}</p>
                    </div>
                    <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setDialogException(exception)} aria-label="Edit exception" title="Edit exception"><Pencil className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => setExceptionToDelete(exception)} aria-label="Delete exception" title="Delete exception"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                </div>)}
            </CardContent>
        </Card>
        <Dialog open={dialogException !== null} onOpenChange={(open) => !open && setDialogException(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{dialogException === "new" ? "Add exception" : "Edit exception"}</DialogTitle>
                    <DialogDescription>Define when this compliance rule should be exempted.</DialogDescription>
                </DialogHeader>
                {dialogException && <ExceptionForm
                    initialValues={dialogException === "new" ? undefined : dialogException}
                    idPrefix={`exception-${dialogException === "new" ? "new" : dialogException.id}`}
                    onSubmit={handleSubmit}
                    onCancel={() => setDialogException(null)}
                    submitLabel={dialogException === "new" ? "Add exception" : "Save changes"}
                    pendingLabel={dialogException === "new" ? "Adding..." : "Saving..."}
                />}
            </DialogContent>
        </Dialog>
        <ConfirmationDialog
            isOpen={exceptionToDelete !== null}
            onClose={() => setExceptionToDelete(null)}
            onConfirm={handleDelete}
            title="Delete exception"
            description="Are you sure you want to delete this exception? This action cannot be undone."
            confirmLabel="Delete"
        />
    </>;
}