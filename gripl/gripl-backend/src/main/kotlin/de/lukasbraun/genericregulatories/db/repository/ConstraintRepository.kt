package de.lukasbraun.genericregulatories.db.repository

import de.lukasbraun.genericregulatories.db.dto.ComplianceConceptCategory
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
            leftOperandName = rs.getString("left_operand_name"),
            leftOperandConcept = ComplianceConceptCategory.valueOf(rs.getString("left_operand_concept")),
            rightOperandName = rs.getString("right_operand_name"),
            rightOperandConcept = ComplianceConceptCategory.valueOf(rs.getString("right_operand_concept")),
        )
    }

    override fun add(entity: Constraint) {
        val sql =
            "INSERT INTO \"${Constraint.TABLE_NAME}\" (compliance_rule_id, perspective, predicate, operator, condition, left_operand_name, left_operand_concept, right_operand_name, right_operand_concept) VALUES (?, ?::compliance_perspective, ?, ?, ?, ?, ?::compliance_concept_category, ?, ?::compliance_concept_category)"
        jdbc.update(
            sql,
            entity.complianceRuleId,
            entity.perspective.name,
            entity.predicate,
            entity.operator,
            entity.condition,
            entity.leftOperandName,
            entity.leftOperandConcept.name,
            entity.rightOperandName,
            entity.rightOperandConcept.name
        )
    }

    override fun getById(id: Long): Constraint? {
        val sql = "SELECT * FROM \"${Constraint.TABLE_NAME}\" WHERE id = ?"
        return jdbc.query(sql, mapper, id).firstOrNull()
    }

    override fun getAll(): List<Constraint> {
        val sql = "SELECT * FROM \"${Constraint.TABLE_NAME}\""
        return jdbc.query(sql, mapper)
    }

    override fun delete(id: Long) {
        val sql = "DELETE FROM \"${Constraint.TABLE_NAME}\" WHERE id = ?"
        jdbc.update(sql, id)
    }

    override fun update(entity: Constraint) {
        val sql =
            "UPDATE \"${Constraint.TABLE_NAME}\" SET compliance_rule_id = ?, perspective = ?::compliance_perspective, predicate = ?, operator = ?, condition = ?, left_operand_name = ?, left_operand_concept = ?::compliance_concept_category, right_operand_name = ?, right_operand_concept = ?::compliance_concept_category WHERE id = ?"
        jdbc.update(
            sql,
            entity.complianceRuleId,
            entity.perspective.name,
            entity.predicate,
            entity.operator,
            entity.condition,
            entity.leftOperandName,
            entity.leftOperandConcept.name,
            entity.rightOperandName,
            entity.rightOperandConcept.name,
            entity.id
        )
    }
}