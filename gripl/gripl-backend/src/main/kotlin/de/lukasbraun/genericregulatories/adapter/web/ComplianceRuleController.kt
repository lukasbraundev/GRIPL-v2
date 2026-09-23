package de.lukasbraun.genericregulatories.adapter.web

import de.lukasbraun.genericregulatories.db.dto.ComplianceRule
import de.lukasbraun.genericregulatories.db.repository.ComplianceRuleRepository
import de.lukasbraun.genericregulatories.db.repository.IDatabaseRepository
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping

@RestController
@RequestMapping("/compliance-rule")
@Tag(name = "Compliance Rule Controller", description = "Controller for managing compliance rules")
class ComplianceRuleController (
    private val complianceRuleRepository: IDatabaseRepository<ComplianceRule>,
){
    @GetMapping("/{complianceRuleId}")
    @Operation(summary = "Returns a compliance rule by ID")
    fun getComplianceRuleById(@PathVariable complianceRuleId: Long): ResponseEntity<ComplianceRule> {
        return complianceRuleRepository.getById(complianceRuleId)?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    }

    @GetMapping("/regulation/{regulationId}")
    @Operation(summary = "Returns all compliance rules for a given regulation")
    fun getComplianceRulesByRegulationId(@PathVariable regulationId: Long): ResponseEntity<List<ComplianceRule>> {
        return ResponseEntity.ok((complianceRuleRepository as? ComplianceRuleRepository)?.getAllByRegulationId(regulationId) ?: emptyList())
    }

    @GetMapping("/")
    @Operation(summary = "Returns all compliance rules for a given regulation")
    fun getAllComplianceRules(): ResponseEntity<List<ComplianceRule>> {
        return ResponseEntity.ok(complianceRuleRepository.getAll())
    }

    @PostMapping("/")
    @Operation(summary = "Adds a new compliance rule to the database")
    fun addComplianceRule(rule: ComplianceRule) : HttpStatus {
        complianceRuleRepository.add(rule)
        return HttpStatus.CREATED
    }

    @PutMapping("/")
    @Operation(summary = "Updates an existing compliance rule")
    fun updateComplianceRule(rule: ComplianceRule) : HttpStatus {
        complianceRuleRepository.update(rule)
        return HttpStatus.OK
    }

    @DeleteMapping("/{complianceRuleId}")
    @Operation(summary = "Deletes an existing compliance rule")
    fun deleteComplianceRule(@PathVariable complianceRuleId: Long) : HttpStatus {
        complianceRuleRepository.delete(complianceRuleId)
        return HttpStatus.OK
    }
}