package de.lukasbraun.genericregulatories.db.dto

import de.lukasbraun.genericregulatories.db.repository.IDatabaseRepository
import org.springframework.jdbc.core.JdbcTemplate
import java.sql.ResultSet

class ViolationRepository(
    private val jdbc: JdbcTemplate
) : IDatabaseRepository<Violation> {

    private val mapper = { rs: ResultSet, _: Int ->
        Violation.fromRow(
            id = rs.getLong("id"),
            severity = ComplianceViolationServerity.valueOf(rs.getString("severity")),
            title = rs.getString("title"),
            message = rs.getString("message"),
            recommendation = rs.getString("recommendation"),
        )
    }

    override fun add(entity: Violation) {
        val sql = "INSERT INTO ${Violation.TABLE_NAME} (severity, title, message, recommendation) VALUES (?, ?, ?, ?)"
        jdbc.update(sql, entity.severity.name, entity.title, entity.message, entity.recommendation)
    }

    override fun getById(id: Long): Violation? {
        val sql = "SELECT * FROM ${Violation.TABLE_NAME} WHERE id = ?"
        return jdbc.query(sql, mapper, id).firstOrNull()
    }

    override fun getAll(): List<Violation> {
        val sql = "SELECT * FROM ${Violation.TABLE_NAME}"
        return jdbc.query(sql, mapper)
    }

    override fun delete(id: Long) {
        val sql = "DELETE FROM ${Violation.TABLE_NAME} WHERE id = ?"
        jdbc.update(sql, id)
    }

    override fun update(entity: Violation) {
        val sql =
            "UPDATE ${Violation.TABLE_NAME} SET severity = ?, title = ?, message = ?, recommendation = ? WHERE id = ?"
        jdbc.update(sql, entity.severity.name, entity.title, entity.message, entity.recommendation, entity.id)
    }
}