/**
 * Clase base para todos los errores de la aplicación.
 * Solo define message y code de negocio. El statusCode HTTP es mapeado por infraestructura.
 */
export class AppError extends Error {
	constructor(
		public override readonly message: string,
		public readonly code: string,
	) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "No autorizado, ingrese el BearerAuthToken") {
		super(message, "UNAUTHORIZED");
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Recurso no encontrado") {
		super(message, "NOT_FOUND");
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, "VALIDATION_ERROR");
	}
}
