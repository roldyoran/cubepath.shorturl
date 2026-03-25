import { and, eq, sql } from "drizzle-orm";
import type { DrizzleDB } from "@/db";
import { urlsTable } from "@/db/schema";
import type { CreateUrlInput, UrlEntity } from "@/domain/url/url.entity";
import type { UrlRepositoryPort } from "@/domain/url/url.repository.port";

function generateShortCode(length = 9): string {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

function mapToEntity(row: typeof urlsTable.$inferSelect): UrlEntity {
	return {
		id: row.id,
		originalUrl: row.originalUrl,
		shortCode: row.shortCode,
		createdAt:
			row.createdAt instanceof Date
				? row.createdAt.toISOString()
				: String(row.createdAt),
		visits: row.visits,
	};
}

export class UrlRepository implements UrlRepositoryPort {
	constructor(private readonly db: DrizzleDB) {}

	async findAll(): Promise<UrlEntity[]> {
		const rows = await this.db.select().from(urlsTable);
		return rows.map(mapToEntity);
	}

	async findByShortCode(shortCode: string): Promise<UrlEntity | null> {
		const [url] = await this.db
			.select()
			.from(urlsTable)
			.where(eq(urlsTable.shortCode, shortCode));
		return url ? mapToEntity(url) : null;
	}

	async findByOriginalUrl(originalUrl: string): Promise<UrlEntity | null> {
		const [url] = await this.db
			.select()
			.from(urlsTable)
			.where(eq(urlsTable.originalUrl, originalUrl));
		return url ? mapToEntity(url) : null;
	}

	async deleteByShortCode(shortCode: string): Promise<UrlEntity | null> {
		const [deleted] = await this.db
			.delete(urlsTable)
			.where(eq(urlsTable.shortCode, shortCode))
			.returning();
		return deleted ? mapToEntity(deleted) : null;
	}

	async deleteAll(): Promise<void> {
		await this.db.delete(urlsTable);
	}

	async create(input: CreateUrlInput): Promise<UrlEntity> {
		const shortCode = input.shortCode ?? generateShortCode();

		const [created] = await this.db
			.insert(urlsTable)
			.values({ originalUrl: input.originalUrl, shortCode })
			.returning();

		return mapToEntity(created);
	}

	async incrementVisits(shortCode: string): Promise<UrlEntity | null> {
		const [updated] = await this.db
			.update(urlsTable)
			.set({ visits: sql`${urlsTable.visits} + 1` })
			.where(eq(urlsTable.shortCode, shortCode))
			.returning();
		return updated ? mapToEntity(updated) : null;
	}
}
