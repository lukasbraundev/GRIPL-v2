package de.mertendieckmann.griplbackend

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info
import io.swagger.v3.oas.annotations.servers.Server
import org.jline.utils.Log
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@OpenAPIDefinition(
	info = Info(title = "GRIPL API", description = "GRIPL Backend API"),
	servers = [Server(url = "\${app.backend.base-url:http://localhost:8080}", description = "Base URL of the API")]
)
@SpringBootApplication(
	scanBasePackages = [
		"de.mertendieckmann.griplbackend",
		"de.lukasbraun.genericregulatories"
	]
)
@ConfigurationPropertiesScan
class GriplBackendApplication

fun main(args: Array<String>) {
	org.jline.utils.Log.info("GRIPL Backend Application started successfully.")
	org.jline.utils.Log.info($$"Swagger can be accessed at: http://localhost:8080/swagger-ui")
	runApplication<GriplBackendApplication>(*args)
}
