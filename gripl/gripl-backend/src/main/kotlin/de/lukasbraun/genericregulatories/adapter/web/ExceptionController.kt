package de.lukasbraun.genericregulatories.adapter.web

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
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

typealias DbException = de.lukasbraun.genericregulatories.db.dto.Exception


@RestController
@RequestMapping("/exception")
@Tag(name = "Exception Controller", description = "Controller for managing exceptions in the database.")
class ExceptionController (
    val exceptionRepository: IDatabaseRepository<de.lukasbraun.genericregulatories.db.dto.Exception>
){
    @Operation(
        summary = "Get all exceptions",
        description = "Returns a list of all exceptions in the database."
    )
    @GetMapping
    fun getAllExceptions(): ResponseEntity<List<DbException>> {
        return ResponseEntity.ok(exceptionRepository.getAll())
    }

    @Operation(
        summary = "Get exception by ID",
        description = "Returns the details of an exception by its ID."
    )
    @GetMapping("/{id}")
    fun getExceptionById(@PathVariable id: Long): ResponseEntity<DbException> {
        val exception = exceptionRepository.getById(id)
        return if (exception != null) {
            ResponseEntity.ok(exception)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @Operation(
        summary = "Get exceptions by compliance rule ID",
        description = "Returns a list of exceptions for a specific compliance rule."
    )
    @GetMapping("/byComplianceRule/{complianceRuleId}")
    fun getExceptionsByComplianceRuleId(@PathVariable complianceRuleId: Long): ResponseEntity<List<DbException>> {
        return ResponseEntity.ok(exceptionRepository.getAll().filter { it.complianceRuleId == complianceRuleId })
    }

    @Operation(
        summary = "Add a new exception",
        description = "Adds a new exception to the database."
    )
    @PostMapping
    fun addException(exception: DbException): HttpStatus {
        exceptionRepository.add(exception)
        return HttpStatus.CREATED
    }

    @Operation(
        summary = "Update an existing exception",
        description = "Updates the details of an existing exception in the database."
    )
    @PutMapping
    fun updateException(exception: DbException): HttpStatus {
        exceptionRepository.update(exception)
        return HttpStatus.OK
    }
    @Operation(
        summary = "Delete an exception",
        description = "Deletes an exception from the database."
    )
    @DeleteMapping("/{id}")
    fun deleteException(@PathVariable id: Long): HttpStatus {
        exceptionRepository.delete(id)
        return HttpStatus.NO_CONTENT
    }
}