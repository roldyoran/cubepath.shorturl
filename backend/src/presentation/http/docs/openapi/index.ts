export function getOpenAPIDocument() {
	return {
		openapi: "3.1.0",
		info: {
			title: "Cubepath.Shorturl API",
			version: "1.0.0",
			description: "API acortadora de URLs con Infraestructura CubePath",
		},
		servers: [
			{
				url: "http://cubepathshorturl-zyojcm-c8fd35-144-225-147-24.traefik.me",
			},
			{ url: "http://localhost:5044" },
			{ url: "http://localhost:3000" },
		],
		paths: {
			"/": {
				get: {
					summary: "Bienvenida",
					description: "Mensaje de bienvenida",
					responses: {
						200: {
							description: "Mensaje de bienvenida",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: { type: "string" },
											version: { type: "string" },
										},
									},
								},
							},
						},
					},
				},
			},
			"/v1/urls": {
				get: {
					tags: ["URLs"],
					summary: "Listar todas las URLs",
					description: "Retorna todas las URLs almacenadas en la base de datos",
					responses: {
						200: {
							description: "Lista de URLs",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: {
											type: "object",
											properties: {
												id: { type: "integer" },
												originalUrl: { type: "string" },
												shortCode: { type: "string" },
												createdAt: { type: "string" },
												visits: { type: "integer" },
											},
										},
									},
								},
							},
						},
					},
				},
				post: {
					tags: ["URLs"],
					summary: "Crear URL corta",
					description: "Crea una nueva URL corta. El shortCode es opcional.",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["originalUrl"],
									properties: {
										originalUrl: { type: "string", format: "uri" },
										shortCode: {
											type: "string",
											maxLength: 9,
											pattern: "^[a-z0-9]+$",
										},
									},
								},
							},
						},
					},
					responses: {
						201: {
							description: "URL creada",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											id: { type: "integer" },
											originalUrl: { type: "string" },
											shortCode: { type: "string" },
											createdAt: { type: "string" },
											visits: { type: "integer" },
										},
									},
								},
							},
						},
						400: { description: "Error de validación" },
						409: { description: "ShortCode en uso" },
					},
				},
			},
			"/v1/urls/{shortCode}": {
				get: {
					tags: ["URLs"],
					summary: "Obtener URL por shortCode",
					description: "Busca una URL por su código corto",
					parameters: [
						{
							name: "shortCode",
							in: "path",
							required: true,
							schema: { type: "string", maxLength: 9, pattern: "^[a-z0-9]+$" },
						},
					],
					responses: {
						200: {
							description: "URL encontrada",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											id: { type: "integer" },
											originalUrl: { type: "string" },
											shortCode: { type: "string" },
											createdAt: { type: "string" },
											visits: { type: "integer" },
										},
									},
								},
							},
						},
						404: { description: "No encontrada" },
					},
				},
			},
			"/{shortCode}": {
				get: {
					tags: ["Redirect"],
					summary: "Redireccionar a URL original",
					description:
						"Redirige al usuario a la URL original asociada al shortCode",
					parameters: [
						{
							name: "shortCode",
							in: "path",
							required: true,
							schema: { type: "string", maxLength: 9, pattern: "^[a-z0-9]+$" },
						},
					],
					responses: {
						302: { description: "Redirect a la URL original" },
						404: { description: "URL no encontrada" },
					},
				},
			},
			"/v1/admin/urls": {
				delete: {
					tags: ["Admin"],
					summary: "Eliminar todas las URLs",
					description: "Elimina todas las URLs de la base de datos",
					security: [{ BearerAuth: [] }],
					responses: {
						200: { description: "Todas las URLs eliminadas" },
						401: { description: "No autorizado" },
					},
				},
			},
			"/v1/admin/urls/{shortCode}": {
				delete: {
					tags: ["Admin"],
					summary: "Eliminar URL por shortCode",
					description: "Elimina una URL específica por su código corto",
					security: [{ BearerAuth: [] }],
					parameters: [
						{
							name: "shortCode",
							in: "path",
							required: true,
							schema: { type: "string", maxLength: 9, pattern: "^[a-z0-9]+$" },
						},
					],
					responses: {
						200: { description: "URL eliminada" },
						401: { description: "No autorizado" },
						404: { description: "URL no encontrada" },
					},
				},
			},
		},
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "API Key",
				},
			},
		},
	};
}
