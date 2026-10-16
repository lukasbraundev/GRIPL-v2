"use client"

import {useState} from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ChevronDown, ChevronUp} from "lucide-react";
import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import TestCaseCard from "@/components/labeling/test-case-card";
import CreateTestCaseButton from "@/components/labeling/create-test-case-button";
import DeleteDatasetButton from "@/components/labeling/delete-dataset-button";
import {Dataset} from "@/models/dto/Dataset";
import {Regulatory} from "@/models/dto/Regulatory";
import EditDatasetButton from "@/components/labeling/edit-dataset-button";

interface DatasetListProps {
    dataset: Dataset;
    evaluationMetadata: EvaluationDataMeta[];
    regulatories: Regulatory[];
    className?: string;
}

export default function DatasetListItem({ dataset, evaluationMetadata, regulatories, className }: DatasetListProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="mb-4 flex w-full flex-row items-stretch gap-2">
            <CollapsibleTrigger className="min-w-0 flex-1">
                <Card className="w-full">
                    <CardHeader className="flex-row justify-between items-center">
                        <CardTitle>
                            {dataset.name} ({dataset.id}) · {dataset.type === "GDPR" ? "GDPR" : "Generic regulatories"}
                        </CardTitle>
                        { dataset.description && <CardDescription>{dataset.description}</CardDescription> }
                        <>{ isOpen ? <ChevronDown /> : <ChevronUp /> }</>
                    </CardHeader>
                </Card>
            </CollapsibleTrigger>
            <div className="flex shrink-0 items-center gap-2">
                <CreateTestCaseButton dataset={dataset} />
                <EditDatasetButton dataset={dataset} regulatories={regulatories}/>
                <DeleteDatasetButton dataset={dataset} />
            </div>
        </div>
        <CollapsibleContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 overflow-y-auto gap-4 pb-4">
                {evaluationMetadata.sort((a, b) => a.id - b.id).map(meta =>
                    <TestCaseCard metadata={meta} key={meta.id}/>
                )}
            </div>
        </CollapsibleContent>
    </Collapsible>
}