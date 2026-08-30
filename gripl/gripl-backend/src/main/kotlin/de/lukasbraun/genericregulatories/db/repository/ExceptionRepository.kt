package de.lukasbraun.genericregulatories.db.repository

import org.springframework.jdbc.core.JdbcTemplate
import de.lukasbraun.genericregulatories.db.dto.Exception
import org.springframework.stereotype.Repository
import java.sql.ResultSet

@Repository
class ExceptionRepository(
    private val jdbc: JdbcTemplate,
) : IDatabaseRepository<Exception> {

    private val mapper = { rs: ResultSet, _: Int ->
        Exception.fromRow(
            id = rs.getLong("id"),
            complianceRuleId = rs.getLong("compliance_rule_id"),
            condition = rs.getString("condition"),
            description = rs.getString("description"),
        )
    }
    override fun add(entity: Exception) {
        val sql = "INSERT INTO ${Exception.TABLE_NAME} (compliance_rule_id, condition, description) VALUES (?, ?, ?)"
        jdbc.update(sql, entity.complianceRuleId, entity.condition, entity.description)
    }

    override fun getById(id: Long): Exception? {
        val sql = "SELECT * FROM ${Exception.TABLE_NAME} WHERE id = ?"
        return jdbc.query(sql, mapper, id).firstOrNull()
    }

    override fun getAll(): List<Exception> {
        val sql = "SELECT * FROM ${Exception.TABLE_NAME}"
        return jdbc.query(sql, mapper)
    }

    override fun delete(id: Long) {
        val sql = "DELETE FROM ${Exception.TABLE_NAME} WHERE id = ?"
        jdbc.update(sql, id)
    }

    override fun update(entity: Exception) {
        val sql = "UPDATE ${Exception.TABLE_NAME} SET compliance_rule_id = ?, condition = ?, description = ? WHERE id = ?"
        jdbc.update(sql, entity.complianceRuleId, entity.condition, entity.description, entity.id)
    }
}
