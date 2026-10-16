import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import DatasetListItem from "@/components/labeling/dataset-list-item";
import {Dataset} from "@/models/dto/Dataset";
import {Regulatory} from "@/models/dto/Regulatory";

interface DatasetListProps {
    datasets: Dataset[];
    evaluationMetadata: EvaluationDataMeta[];
    regulatories: Regulatory[];
    className?: string;
}

export default function DatasetList({ datasets, evaluationMetadata, regulatories, className }: DatasetListProps) {
    return <div className={`h-full flex flex-col justify-start ${className}`}>
        { datasets.map(dataset =>
            <DatasetListItem
                dataset={dataset}
                evaluationMetadata={evaluationMetadata.filter(meta => meta.datasetId == dataset.id)}
                regulatories={regulatories}
                key={`${dataset.id}-dataset-list-item`} className="mb-4"
            />
        )}
    </div>
}