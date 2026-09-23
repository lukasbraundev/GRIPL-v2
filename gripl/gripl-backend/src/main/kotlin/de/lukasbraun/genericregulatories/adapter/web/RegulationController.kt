package de.lukasbraun.genericregulatories.adapter.web

import de.lukasbraun.genericregulatories.db.dto.Regulation
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

@RestController
@RequestMapping("/regulation")
@Tag(name = "Regulation Controller", description = "Controller for managing regulations in the database.")
class RegulationController (
    private val regulatoryRepository: IDatabaseRepository<Regulation>
){
    @Operation(
        summary = "Get Regulation by ID",
        description = "Returns the details of a regulation by its ID."
    )
    @GetMapping("/{id}")
    fun getRegulatoryById(@PathVariable id: Long): ResponseEntity<Regulation> {
        val regulation = regulatoryRepository.getById(id)
        return if (regulation != null) {
            ResponseEntity.ok(regulation)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @Operation(
        summary = "Get all Regulations",
        description = "Returns a list of all regulations in the database."
    )
    @GetMapping("/")
    fun getAllRegulatory(): ResponseEntity<List<Regulation>> {
        val regulations = regulatoryRepository.getAll()
        if (regulations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(emptyList())
        }
        return ResponseEntity.ok(regulations)
    }

    @Operation(
        summary = "Add a new Regulation",
        description = "Adds a new regulation to the database."
    )
    @PostMapping("/")
    fun addRegulatory(regulation: Regulation) : HttpStatus {
        regulatoryRepository.add(regulation)
        return HttpStatus.CREATED
    }

    @Operation(
        summary = "Update an existing Regulation",
        description = "Updates the details of an existing regulation."
    )
    @PutMapping("/")
    fun updateRegulatory(regulation: Regulation) : HttpStatus {
        regulatoryRepository.update(regulation)
        return HttpStatus.OK
    }

    @Operation(
        summary = "Delete a Regulation by ID",
        description = "Deletes a regulation from the database by its ID."
    )
    @DeleteMapping("/{id}")
    fun deleteRegulatory(@PathVariable id: Long) : HttpStatus{
        regulatoryRepository.delete(id)
        return HttpStatus.OK
    }
}