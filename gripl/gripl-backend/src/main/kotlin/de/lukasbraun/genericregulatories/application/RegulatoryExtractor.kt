package de.lukasbraun.genericregulatories.application

import de.lukasbraun.genericregulatories.db.dto.Constraint
import de.lukasbraun.genericregulatories.db.dto.ComplianceRule
import de.lukasbraun.genericregulatories.db.dto.Regulation
import de.lukasbraun.genericregulatories.db.repository.IDatabaseRepository
import org.springframework.stereotype.Component

@Component
class RegulatoryExtractor(
    private val constraintRepository: IDatabaseRepository<Constraint>,
    private val complianceRuleRepository: IDatabaseRepository<ComplianceRule>,
    private val regulationRepository: IDatabaseRepository<Regulation>,
) {

    fun extractRegulatoryElements(regulatoryIds: List<Long>): List<String> {
        val regulationsById = regulationRepository.getAll()
            .filter { it.id in regulatoryIds }
            .associateBy { it.id }
        val rulesById = complianceRuleRepository.getAll()
            .filter { it.regulationId in regulatoryIds }
            .associateBy { it.id }

        return constraintRepository.getAll()
            .mapNotNull { constraint ->
                val rule = rulesById[constraint.complianceRuleId] ?: return@mapNotNull null
                val regulation = regulationsById[rule.regulationId] ?: return@mapNotNull null

                buildString {
                    append("Regulation: ${regulation.title}")
                    append(" (ID: ${regulation.id}, version: ${regulation.version})\n")
                    append("Rule: ${rule.name}")
                    rule.description?.let { append(" - $it") }
                    append(" [severity: ${rule.severity}]\n")
                    append("Constraint: ${constraint.leftOperandName} ")
                    append("${constraint.operator} ${constraint.rightOperandName}")
                    append(" (${constraint.predicate}")
                    constraint.condition.takeIf { it.isNotBlank() }?.let { append("; condition: $it") }
                    append(")")
                }
            }
    }
}