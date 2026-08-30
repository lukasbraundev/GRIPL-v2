package de.lukasbraun.genericregulatories.db.dto

class Regulation (
    val id: Long,
    val title: String,
    val version: String,
    val authority : String,
)
{
    companion object {
        fun fromRow(id: Long, title: String, version: String, authority: String): Regulation {
            return Regulation(id = id, title = title, version = version, authority = authority)
        }
        internal const val TABLE_NAME = "regulation"
    }
}