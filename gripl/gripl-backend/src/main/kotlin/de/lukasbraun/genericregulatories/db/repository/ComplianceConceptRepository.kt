package de.lukasbraun.genericregulatories.db.repository

import de.lukasbraun.genericregulatories.db.dto.ComplianceConcept
import de.lukasbraun.genericregulatories.db.dto.ComplianceConceptCategory
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.ResultSet

@Repository
class ComplianceConceptRepository(
    private val jdbc: JdbcTemplate,
) : IDatabaseRepository<ComplianceConcept> {

    private val mapper = { rs: ResultSet, _: Int ->
        ComplianceConcept.fromRow(
            id = rs.getLong("id"),
            name = rs.getString("name"),
            conceptCategory = ComplianceConceptCategory.valueOf(rs.getString("concept_category")),
        )
    }
    override fun add(entity: ComplianceConcept) {
        val sql = "INSERT INTO ${ComplianceConcept.TABLE_NAME} (name, concept_category) VALUES (?, ?)"
        jdbc.update(sql, entity.name, entity.conceptCategory.name)
    }

    override fun getById(id: Long): ComplianceConcept? {
        val sql = "SELECT * FROM ${ComplianceConcept.TABLE_NAME} WHERE id = ?"
        return jdbc.query(sql, mapper, id).firstOrNull()
    }

    override fun getAll(): List<ComplianceConcept> {
        val sql = "SELECT * FROM ${ComplianceConcept.TABLE_NAME}"
        return jdbc.query(sql, mapper)
    }

    override fun delete(id: Long) {
        val sql = "DELETE FROM ${ComplianceConcept.TABLE_NAME} WHERE id = ?"
        jdbc.update(sql, id)
    }

    override fun update(entity: ComplianceConcept) {
        val sql = "UPDATE ${ComplianceConcept.TABLE_NAME} SET name = ?, concept_category = ? WHERE id = ?"
        jdbc.update(sql, entity.name, entity.conceptCategory.name, entity.id)
    }
}