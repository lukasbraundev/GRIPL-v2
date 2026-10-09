"use client"

import {useEffect, useState} from "react";
import {BookOpenCheck, Check, Loader2} from "lucide-react";
import getRegulatories from "@/actions/generic-regulatories/get-regulatories";
import {Regulatory} from "@/models/dto/Regulatory";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";
import {LlmPropsOverride} from "@/models/dto/MultiEvaluationRequest";
import analyzeBpmnForGenericRegulatories from "@/actions/generic-regulatories/analyze-bpmn";
import {AnalysisResult} from "@/models/dto/AnalysisDto";

interface GenericRegulatoryAnalysisButtonProps {
    bpmnXml: string;
    llmProps: LlmPropsOverride;
    setAnalysisResult: (result: AnalysisResult | null) => void;
}

export default function GenericRegulatoryAnalysisButton({
    bpmnXml,
    llmProps,
    setAnalysisResult,
}: GenericRegulatoryAnalysisButtonProps) {
    const [open, setOpen] = useState(false);
    const [regulatories, setRegulatories] = useState<Regulatory[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoadingRegulatories, setIsLoadingRegulatories] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const {showToast, showError} = useToast();

    useEffect(() => {
        if (!open) return;

        setIsLoadingRegulatories(true);
        getRegulatories()
            .then(setRegulatories)
            .catch((error) => showError("Failed to load regulatories", toErrorMessage(error)))
            .finally(() => setIsLoadingRegulatories(false));
    }, [open, showError]);

    function toggleRegulatory(regulatoryId: number) {
        setSelectedIds((current) =>
            current.includes(regulatoryId)
                ? current.filter((id) => id !== regulatoryId)
                : [...current, regulatoryId]
        );
    }

    async function handleEvaluation() {
        if (selectedIds.length === 0 || !bpmnXml) return;

        setIsEvaluating(true);
        try {
            const result = await analyzeBpmnForGenericRegulatories(bpmnXml, selectedIds, llmProps);

            setAnalysisResult(result);
            setOpen(false);
            showToast({
                title: "Generic regulatory evaluation completed",
                description: `${result.criticalElements.length} critical element(s) found.`,
                variant: "success",
            });
        } catch (error) {
            showError("Failed to evaluate generic regulatories", toErrorMessage(error));
        } finally {
            setIsEvaluating(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(true)}
                disabled={!bpmnXml || isEvaluating}
            >
                <BookOpenCheck className="mr-2 h-4 w-4"/>
                Use generic regulatories
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select regulatories</DialogTitle>
                    <DialogDescription>
                        Choose the regulatory frameworks to evaluate against this BPMN diagram.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-64 overflow-y-auto rounded-md border">
                    {isLoadingRegulatories ? (
                        <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
                            <Spinner className="h-4 w-4"/>
                            Loading regulatories...
                        </div>
                    ) : regulatories.length === 0 ? (
                        <p className="p-6 text-center text-sm text-muted-foreground">
                            No regulatories are available. Add one in the Regulatories section first.
                        </p>
                    ) : (
                        <div className="divide-y">
                            {regulatories.map((regulatory) => {
                                const selected = selectedIds.includes(regulatory.id);
                                return (
                                    <label
                                        key={regulatory.id}
                                        className="flex cursor-pointer items-center gap-3 p-3 hover:bg-muted/50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={() => toggleRegulatory(regulatory.id)}
                                            className="sr-only"
                                        />
                                        <span
                                            aria-hidden="true"
                                            className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                                selected ? "border-primary bg-primary text-primary-foreground" : "border-input"
                                            }`}
                                        >
                                            {selected && <Check className="h-3 w-3"/>}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block font-medium">{regulatory.title}</span>
                                            <span className="block text-xs text-muted-foreground">
                                                Version {regulatory.version} · {regulatory.authority}
                                            </span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isEvaluating}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleEvaluation}
                        disabled={isLoadingRegulatories || selectedIds.length === 0 || isEvaluating}
                    >
                        {isEvaluating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Evaluating...
                            </>
                        ) : (
                            "Evaluate selected"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
