package de.mertendieckmann.griplbackend.model.dto

data class CreateDatasetRequest(
    val name: String,
    val description: String? = null,
    val type: DatasetType = DatasetType.GDPR,
    val regulationIds: List<Long> = emptyList()
)