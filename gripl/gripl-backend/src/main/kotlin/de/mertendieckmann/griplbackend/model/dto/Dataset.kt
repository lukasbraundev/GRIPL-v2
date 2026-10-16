package de.mertendieckmann.griplbackend.model.dto

enum class DatasetType {
    GDPR,
    GENERIC_REGULATORIES
}

data class Dataset(
    val id: Long,
    val name: String,
    val description: String? = null,
    val createdAt: String,
    val updatedAt:String,
    val type: DatasetType,
    val regulationIds: List<Long>
) {
    companion object {

        fun fromRow(
            id: Long,
            name: String,
            description: String?,
            createdAt: String,
            updatedAt: String,
            type: DatasetType,
            regulationIds: List<Long>
        ): Dataset {
            return Dataset(
                id = id,
                name = name,
                description = description,
                createdAt = createdAt,
                updatedAt = updatedAt,
                type = type,
                regulationIds = regulationIds
            )
        }
    }
}