import Link from "next/link";
import {BookOpenText, ExternalLink, ShieldCheck} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Regulatory} from "@/models/dto/Regulatory";
import EditRegulatoryDialog from "@/components/regulatories/edit-regulatory-dialog";
import DeleteRegulatoryButton from "@/components/regulatories/delete-regulatory-button";
import RegulatoryImportExport, {RegulatoryExport} from "@/components/regulatories/regulatory-import-export";

interface RegulatoryListProps {
    regulatories: Regulatory[];
    exportData: RegulatoryExport[];
    className?: string;
}

export default function RegulatoryList({regulatories, exportData, className}: RegulatoryListProps) {
    if (regulatories.length === 0) {
        return <Card className={className}>
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                    <BookOpenText className="h-6 w-6"/>
                </div>
                <h2 className="text-lg font-semibold">No regulatories yet</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Add a regulatory framework to make it available for your process analysis.
                </p>
            </CardContent>
        </Card>;
    }

    return <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${className ?? ""}`}>
        {regulatories.map((regulatory) =>
            <Card key={regulatory.id} className="flex h-full flex-col transition-shadow hover:shadow-md">
                <CardHeader className="flex-row items-start justify-between gap-4 pb-4">
                    <div className="min-w-0 space-y-1.5">
                        <CardTitle className="truncate text-lg">{regulatory.title}</CardTitle>
                        <CardDescription>Regulatory framework</CardDescription>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary"/>
                        <Button asChild variant="outline" size="icon">
                            <Link
                                href={`/regulatories/${regulatory.id}/rules`}
                                aria-label={`Open compliance rules for ${regulatory.title}`}
                                title={`Open compliance rules for ${regulatory.title}`}
                            >
                                <ExternalLink className="h-4 w-4"/>
                            </Link>
                        </Button>
                        <EditRegulatoryDialog regulatory={regulatory}/>
                        <DeleteRegulatoryButton regulatory={regulatory}/>
                        <RegulatoryImportExport
                            regulatory={regulatory}
                            exportData={exportData.find((item) => item.id === regulatory.id)}
                            showImport={false}
                            exportIconOnly
                        />
                    </div>
                </CardHeader>
                <CardContent className="mt-auto grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Version</p>
                        <p className="mt-1 font-medium">{regulatory.version}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Authority</p>
                        <p className="mt-1 truncate font-medium" title={regulatory.authority}>{regulatory.authority}</p>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>;
}