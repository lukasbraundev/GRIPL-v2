package de.lukasbraun.genericregulatories.db.repository

import de.lukasbraun.genericregulatories.db.dto.CompliancePerspective
import de.lukasbraun.genericregulatories.db.dto.Constraint
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.ResultSet

@Repository
class ConstraintRepository(
    private val jdbc: JdbcTemplate
) : IDatabaseRepository<Constraint> {

    private val mapper = { rs: ResultSet, _: Int ->
        Constraint.fromRow(
            id = rs.getLong("id"),
            complianceRuleId = rs.getLong("compliance_rule_id"),
            perspective = CompliancePerspective.valueOf(rs.getString("perspective")),
            predicate = rs.getString("predicate"),
            operator = rs.getString("operator"),
            condition = rs.getString("condition"),
            leftOperand = ComplianceConceptRepository(jdbc).getById(rs.getLong("left_operand_id"))!!,
            rightOperand = ComplianceConceptRepository(jdbc).getById(rs.getLong("right_operand_id"))!!,
        )
    }

    override fun add(entity: Constraint) {
        val sql =
            "INSERT INTO ${Constraint.TABLE_NAME} (compliance_rule_id, perspective, predicate, operator, condition, left_operand_id, right_operand_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
        jdbc.update(
            sql,
            entity.complianceRuleId,
            entity.perspective.name,
            entity.predicate,
            entity.operator,
            entity.condition,
            entity.leftOperand.id,
            entity.rightOperand.id
        )
    }

    override fun getById(id: Long): Constraint? {
        val sql = "SELECT * FROM ${Constraint.TABLE_NAME} WHERE id = ?"
        return jdbc.query(sql, mapper, id).firstOrNull()
    }

    override fun getAll(): List<Constraint> {
        val sql = "SELECT * FROM ${Constraint.TABLE_NAME}"
        return jdbc.query(sql, mapper)
    }

    override fun delete(id: Long) {
        val sql = "DELETE FROM ${Constraint.TABLE_NAME} WHERE id = ?"
        jdbc.update(sql, id)
    }

    override fun update(entity: Constraint) {
        val sql =
            "UPDATE ${Constraint.TABLE_NAME} SET compliance_rule_id = ?, perspective = ?, predicate = ?, operator = ?, condition = ?, left_operand_id = ?, right_operand_id = ? WHERE id = ?"
        jdbc.update(
            sql,
            entity.complianceRuleId,
            entity.perspective.name,
            entity.predicate,
            entity.operator,
            entity.condition,
            entity.leftOperand.id,
            entity.rightOperand.id,
            entity.id
        )
    }
}