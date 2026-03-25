import { describe, expect, it } from "bun:test";
import {
	AppError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "@/domain/app-error";

describe("AppError", () => {
	it("debe asignar message y code correctamente", () => {
		const error = new AppError("algo falló", "INTERNAL_ERROR");

		expect(error.message).toBe("algo falló");
		expect(error.code).toBe("INTERNAL_ERROR");
	});

	it("debe ser instancia de Error", () => {
		const error = new AppError("msg", "CODE");

		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(AppError);
	});

	it("debe asignar el name al nombre de la clase", () => {
		const error = new AppError("msg", "CODE");

		expect(error.name).toBe("AppError");
	});
});

describe("UnauthorizedError", () => {
	it("debe tener code UNAUTHORIZED", () => {
		const error = new UnauthorizedError();

		expect(error.code).toBe("UNAUTHORIZED");
	});

	it("debe usar el mensaje por defecto si no se especifica", () => {
		const error = new UnauthorizedError();

		expect(error.message).toBe("No autorizado");
	});

	it("debe aceptar un mensaje personalizado", () => {
		const error = new UnauthorizedError("Token expirado");

		expect(error.message).toBe("Token expirado");
	});

	it("debe ser instancia de AppError", () => {
		expect(new UnauthorizedError()).toBeInstanceOf(AppError);
	});
});

describe("NotFoundError", () => {
	it("debe tener code NOT_FOUND", () => {
		const error = new NotFoundError();

		expect(error.code).toBe("NOT_FOUND");
	});

	it("debe usar el mensaje por defecto si no se especifica", () => {
		const error = new NotFoundError();

		expect(error.message).toBe("Recurso no encontrado");
	});

	it("debe aceptar un mensaje personalizado", () => {
		const error = new NotFoundError("URL no encontrada");

		expect(error.message).toBe("URL no encontrada");
	});

	it("debe ser instancia de AppError", () => {
		expect(new NotFoundError()).toBeInstanceOf(AppError);
	});
});

describe("ValidationError", () => {
	it("debe tener code VALIDATION_ERROR", () => {
		const error = new ValidationError("campo requerido");

		expect(error.code).toBe("VALIDATION_ERROR");
	});

	it("debe asignar el mensaje correctamente", () => {
		const error = new ValidationError("Debe ser una URL válida");

		expect(error.message).toBe("Debe ser una URL válida");
	});

	it("debe ser instancia de AppError", () => {
		expect(new ValidationError("msg")).toBeInstanceOf(AppError);
	});
});
