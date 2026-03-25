import type { Context } from "hono";
import { AppError, ValidationError } from "@/domain/app-error";

/**
 * Mapeo de códigos de error de negocio a status HTTP.
 * La infraestructura decide qué status usar basándose en el code del dominio.
 */
const STATUS_CODE_MAP: Record<string, number> = {
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	VALIDATION_ERROR: 400,
	SHORT_CODE_ALREADY_EXISTS: 409,
	URL_NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
};

/**
 * Formato estándar de respuesta de error.
 * Para cambiar la estructura de todos los errores de la API, modifica solo este tipo.
 */
export type ApiErrorResponse = {
	success: false;
	error: {
		code: string;
		message: string;
		statusCode: number;
	};
};

/**
 * Obtiene el status HTTP basado en el código de error de negocio.
 */
function getStatusCode(code: string): number {
	return STATUS_CODE_MAP[code] ?? 500;
}

/**
 * Genera una respuesta HTTP de error estandarizada.
 * Usado tanto por el onError global como por middleware que necesita responder antes de lanzar.
 */
export function errorResponse(c: Context, error: AppError): Response {
	const statusCode = getStatusCode(error.code);
	return c.json<ApiErrorResponse>(
		{
			success: false,
			error: {
				code: error.code,
				message: error.message,
				statusCode,
			},
		},
		statusCode,
	);
}

/**
 * Manejador global de errores para Hono (app.onError).
 * Todos los errores no capturados en rutas o middleware llegan aquí.
 * Los AppError se formatean con errorResponse; el resto se convierte en 500.
 */
// biome-ignore lint/suspicious/noExplicitAny: Hono onError acepta any
export function onError(error: Error, c: Context): Response {
	if (error instanceof AppError) {
		return errorResponse(c, error);
	}

	console.error("[UNHANDLED ERROR]", error);

	return c.json<ApiErrorResponse>(
		{
			success: false,
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message: "Error interno del servidor",
				statusCode: 500,
			},
		},
		500,
	);
}

/**
 * Hook de validación para zValidator.
 * Uso: zValidator("json", schema, validationHook)
 * Estandariza los errores de validación de Zod con el mismo formato que el resto de la API.
 */
// biome-ignore lint/suspicious/noExplicitAny: zValidator hook acepta tipos genéricos
export function validationHook(result: any, c: Context): Response | void {
	if (!result.success) {
		const messages = result.error.issues
			// biome-ignore lint/suspicious/noExplicitAny: Zod issue type
			.map((i: any) => i.message)
			.join("; ");
		return errorResponse(c, new ValidationError(messages));
	}
}
