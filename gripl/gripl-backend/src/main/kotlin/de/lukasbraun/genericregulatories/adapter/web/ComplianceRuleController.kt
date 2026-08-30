package de.lukasbraun.genericregulatories.adapter.web

import de.lukasbraun.genericregulatories.adapter.web.dto.WebComplianceRule
import de.lukasbraun.genericregulatories.db.dto.ComplianceRule
import de.lukasbraun.genericregulatories.db.repository.IDatabaseRepository
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping

@RestController
@RequestMapping("/regulation/{regulationId}/compliance-rule")
@Tag(name = "Compliance Rule Controller", description = "Controller for managing compliance rules")
class ComplianceRuleController (
    private val complianceRuleRepository: IDatabaseRepository<ComplianceRule>,
){
    @GetMapping("/{complianceRuleId}")
    @Operation(summary = "Returns a compliance rule by ID")
    fun getComplianceRuleById(@PathVariable regulationId: Long, @PathVariable complianceRuleId: Long): ComplianceRule? {
        val rule : ComplianceRule? = complianceRuleRepository.getById(complianceRuleId)
        return rule
    }

    @PostMapping("/")
    @Operation(summary = "Adds a new compliance rule to the database")
    fun addComplianceRule(@PathVariable regulationId: Long, rule: ComplianceRule) : HttpStatus {
        complianceRuleRepository.add(rule)
        return HttpStatus.CREATED
    }

    @PutMapping("/")
    @Operation(summary = "Updates an existing compliance rule")
    fun updateComplianceRule(@PathVariable regulationId: Long, rule: WebComplianceRule) : HttpStatus {
        return HttpStatus.BAD_REQUEST
    }

    @DeleteMapping("/{complianceRuleId}")
    @Operation(summary = "Deletes an existing compliance rule")
    fun deleteComplianceRule(@PathVariable regulationId: Long, @PathVariable complianceRuleId: Long) : HttpStatus {
        return HttpStatus.BAD_REQUEST
    }
}