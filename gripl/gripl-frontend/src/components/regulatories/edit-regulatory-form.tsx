"use client"

import {useRouter} from "next/navigation";
import {Regulatory} from "@/models/dto/Regulatory";
import updateRegulatory from "@/actions/generic-regulatories/update-regulatory";
import {useToast} from "@/components/ui/toast";
import {toErrorMessage} from "@/lib/http-error";
import RegulatoryForm, {RegulatoryFormValues} from "@/components/regulatories/regulatory-form";

interface EditRegulatoryFormProps {
    regulatory: Regulatory;
}

export default function EditRegulatoryForm({regulatory}: EditRegulatoryFormProps) {
    const router = useRouter();
    const {showToast, showError} = useToast();

    async function handleSubmit(values: RegulatoryFormValues) {
        try {
            await updateRegulatory(regulatory.id, values.title, values.version, values.authority);
            showToast({title: "Regulatory updated", variant: "success"});
            router.push("/regulatories");
            window.location.reload();
        } catch (error) {
            showError("Failed to update regulatory", toErrorMessage(error));
        }
    }

    return <RegulatoryForm
        initialValues={{title: regulatory.title, version: regulatory.version, authority: regulatory.authority}}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/regulatories")}
        submitLabel="Save changes"
        pendingLabel="Saving..."
        className="max-w-2xl"
    />;
}