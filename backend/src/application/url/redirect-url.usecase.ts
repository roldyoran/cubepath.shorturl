import type { UrlEntity } from "@/domain/url/url.entity";
import type { UrlRepositoryPort } from "@/domain/url/url.repository.port";

export class RedirectUrlUseCase {
	constructor(private readonly urlRepository: UrlRepositoryPort) {}

	async execute(shortCode: string): Promise<UrlEntity | null> {
		const url = await this.urlRepository.findByShortCode(shortCode);
		if (!url) {
			return null;
		}
		return this.urlRepository.incrementVisits(shortCode);
	}
}
