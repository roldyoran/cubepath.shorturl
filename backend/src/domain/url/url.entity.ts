// Entidad de dominio: representa una URL acortada
// No depende de ningún framework ni librería externa
export interface UrlEntity {
	id: number;
	originalUrl: string;
	shortCode: string;
	createdAt: string;
	visits: number;
}

export interface CreateUrlInput {
	originalUrl: string;
	shortCode?: string;
}
