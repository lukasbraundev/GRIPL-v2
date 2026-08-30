package de.lukasbraun.genericregulatories.db.repository

import org.springframework.stereotype.Repository

/**
 * Generic interface for database repositories providing basic CRUD operations.
 *
 * @param T the type of entity handled by the repository
 */
@Repository
interface IDatabaseRepository <T> {
    /**
     * Persist a new entity in the database.
     * Implementations should assign any generated identifiers and return or update the entity accordingly.
     *
     * @param entity the entity to add
     */
    fun add(entity: T);

    /**
     * Retrieve an entity by its numeric identifier.
     *
     * @param id database identifier of the entity
     * @return the entity if found, or null otherwise
     */
    fun getById(id: Long): T?;

    /**
     * Retrieve all entities of type T from the database.
     *
     * @return a list containing all stored entities (may be empty)
     */
    fun getAll(): List<T>;

    /**
     * Delete the entity with the given identifier from the database.
     * Implementations should handle the case where the id does not exist gracefully.
     *
     * @param id database identifier of the entity to delete
     */
    fun delete(id: Long);

    /**
     * Update an existing entity in the database.
     * The implementation should use the entity's identifier to locate and update the stored record.
     *
     * @param entity the entity containing updated values
     */
    fun update(entity: T);
}