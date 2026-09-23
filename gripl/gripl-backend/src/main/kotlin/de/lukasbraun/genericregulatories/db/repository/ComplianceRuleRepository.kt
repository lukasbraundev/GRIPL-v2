package de.lukasbraun.genericregulatories.db.repository

import de.lukasbraun.genericregulatories.db.dto.ComplianceRule
import de.lukasbraun.genericregulatories.db.dto.ComplianceSeverity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.ResultSet

@Repository
class ComplianceRuleRepository (
    private val jdbc: JdbcTemplate
): IDatabaseRepository<ComplianceRule>
{
    private val mapper = { rs: ResultSet, _: Int ->
        ComplianceRule.fromRow(
            id = rs.getLong("id"),
            name = rs.getString("name"),
            description = rs.getString("description"),
            severity = ComplianceSeverity.valueOf(rs.getString("severity")),
            regulationId = rs.getLong("regulation_id"),
        )
    }
    override fun add(entity: ComplianceRule) {
        val sql = "INSERT INTO ${ComplianceRule.TABLE_NAME} (name, description, severity, regulation_id) VALUES (?, ?, ?::compliance_severity, ?)"
        jdbc.update(sql, entity.name, entity.description, entity.severity.name, entity.regulationId)
    }

    override fun getById(id: Long): ComplianceRule? {
        val sql = "SELECT * FROM ${ComplianceRule.TABLE_NAME} WHERE id = ?"
        return jdbc.query(sql, mapper, id).firstOrNull()
    }

    override fun getAll(): List<ComplianceRule> {
        val sql = "SELECT * FROM ${ComplianceRule.TABLE_NAME}"
        return jdbc.query(sql, mapper)
    }

    fun getAllByRegulationId(regulationId: Long): List<ComplianceRule> {
        val sql = "SELECT * FROM ${ComplianceRule.TABLE_NAME} WHERE regulation_id = ?"
        return jdbc.query(sql, mapper, regulationId)
    }

    override fun delete(id: Long) {
        val sql = "DELETE FROM ${ComplianceRule.TABLE_NAME} WHERE id = ?"
        jdbc.update(sql, id)
    }

    override fun update(entity: ComplianceRule) {
        val sql = "UPDATE ${ComplianceRule.TABLE_NAME} SET name = ?, description = ?, severity = ?::compliance_severity, regulation_id = ? WHERE id = ?"
        jdbc.update(sql, entity.name, entity.description, entity.severity.name, entity.regulationId, entity.id)
    }
}