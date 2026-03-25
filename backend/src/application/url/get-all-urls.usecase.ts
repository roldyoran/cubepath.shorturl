import type { UrlEntity } from "@/domain/url/url.entity";
import type { UrlRepositoryPort } from "@/domain/url/url.repository.port";

export class GetAllUrlsUseCase {
	constructor(private readonly urlRepository: UrlRepositoryPort) {}

	async execute(): Promise<UrlEntity[]> {
		return this.urlRepository.findAll();
	}
}
