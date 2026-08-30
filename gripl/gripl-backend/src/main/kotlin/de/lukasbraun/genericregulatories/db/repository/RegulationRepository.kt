package de.lukasbraun.genericregulatories.db.repository

import de.lukasbraun.genericregulatories.db.dto.Regulation
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.ResultSet

@Repository
class RegulationRepository(
    private val jdbc: JdbcTemplate,
) : IDatabaseRepository<Regulation> {

    private val mapper = { rs: ResultSet, _: Int ->
        Regulation.fromRow(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            version = rs.getString("version"),
            authority = rs.getString("authority"),
        )
    }
    override fun add(entity: Regulation) {
        val sql = "INSERT INTO ${Regulation.TABLE_NAME} (title, version, authority) VALUES (?, ?, ?)"
        jdbc.update(sql, entity.title, entity.version, entity.authority)
    }

    override fun getById(id: Long): Regulation? {
        val sql = "SELECT * FROM ${Regulation.TABLE_NAME} WHERE id = ?"
        return jdbc.query(sql, mapper, id).firstOrNull()
    }

    override fun getAll(): List<Regulation> {
        val sql = "SELECT * FROM ${Regulation.TABLE_NAME}"
        return jdbc.query(sql, mapper)
    }

    override fun delete(id: Long) {
        val sql = "DELETE FROM ${Regulation.TABLE_NAME} WHERE id = ?"
        jdbc.update(sql, id)
    }

    override fun update(entity: Regulation) {
        val sql = "UPDATE ${Regulation.TABLE_NAME} SET title = ?, version = ?, authority = ? WHERE id = ?"
        jdbc.update(sql, entity.title, entity.version, entity.authority, entity.id)
    }
}