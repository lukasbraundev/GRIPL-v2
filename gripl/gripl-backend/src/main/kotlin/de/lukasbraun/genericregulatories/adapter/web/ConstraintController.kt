package de.lukasbraun.genericregulatories.adapter.web

import de.lukasbraun.genericregulatories.db.dto.Constraint
import de.lukasbraun.genericregulatories.db.repository.IDatabaseRepository
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping

@RestController
@RequestMapping("/constraint")
@Tag(name = "Constraint Controller", description = "Controller for managing constraints in the database.")
class ConstraintController (
    private val constraintRepository: IDatabaseRepository<Constraint>
){
    @Operation(
        summary = "Get Constraint by ID",
        description = "Returns the details of a constraint by its ID."
    )
    @GetMapping("/{id}")
    fun getConstraintById(@PathVariable id: Long): ResponseEntity<Constraint> {
        val constraint = constraintRepository.getById(id)
        return if (constraint != null) {
            ResponseEntity.ok(constraint)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @Operation(
        summary = "Get All Constraints",
        description = "Returns a list of all constraints in the database."
    )
    @GetMapping
    fun getAllConstraints(): ResponseEntity<List<Constraint>> {
        val constraints = constraintRepository.getAll()
        if (constraints.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(emptyList())
        }
        return ResponseEntity.ok(constraints)
    }

    @Operation(
        summary = "Get Constraints by Compliance Rule ID",
        description = "Returns a list of constraints associated with a specific compliance rule ID."
    )
    @GetMapping("/byComplianceRule/{complianceRuleId}")
    fun getConstraintsByComplianceRuleId(@PathVariable complianceRuleId: Long): ResponseEntity<List<Constraint>> {
        val constraints = constraintRepository.getAll().filter { it.complianceRuleId == complianceRuleId }
        if (constraints.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(emptyList())
        }
        return ResponseEntity.ok(constraints)
    }

    @Operation(
        summary = "Add Constraint",
        description = "Adds a new constraint to the database."
    )
    @PostMapping("/")
    fun addConstraint(@RequestBody constraint: Constraint): HttpStatus {
        constraintRepository.add(constraint)
        return HttpStatus.CREATED
    }

    @Operation(
        summary = "Update Constraint",
        description = "Updates an existing constraint in the database."
    )
    @PutMapping("/")
    fun updateConstraint(@RequestBody constraint: Constraint): HttpStatus {
        constraintRepository.update(constraint)
        return HttpStatus.OK
    }

    @Operation(
        summary = "Delete Constraint",
        description = "Deletes a constraint from the database."
    )
    @DeleteMapping("/delete/{id}")
    fun deleteConstraint(@PathVariable id: Long): HttpStatus {
        constraintRepository.delete(id)
        return HttpStatus.OK
    }

}