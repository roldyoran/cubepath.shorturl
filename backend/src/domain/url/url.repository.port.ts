import type { CreateUrlInput, UrlEntity } from "./url.entity";

// Puerto (interfaz) del repositorio: define el contrato sin conocer la implementación
// La capa de dominio no sabe si la DB es D1, Postgres, SQLite local, etc.
export interface UrlRepositoryPort {
	findAll(): Promise<UrlEntity[]>;
	findByShortCode(shortCode: string): Promise<UrlEntity | null>;
	findByOriginalUrl(originalUrl: string): Promise<UrlEntity | null>;
	create(input: CreateUrlInput): Promise<UrlEntity>;
	deleteByShortCode(shortCode: string): Promise<UrlEntity | null>;
	deleteAll(): Promise<void>;
	incrementVisits(shortCode: string): Promise<UrlEntity | null>;
}
