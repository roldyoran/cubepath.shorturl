import type { UrlEntity } from "@/domain/url/url.entity";
import type { UrlRepositoryPort } from "@/domain/url/url.repository.port";

export class GetUrlByShortCodeUseCase {
	constructor(private readonly urlRepository: UrlRepositoryPort) {}

	async execute(shortCode: string): Promise<UrlEntity | null> {
		return this.urlRepository.findByShortCode(shortCode);
	}
}
