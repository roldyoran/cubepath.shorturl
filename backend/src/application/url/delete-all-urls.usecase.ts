import type { UrlRepositoryPort } from "@/domain/url/url.repository.port";

export class DeleteAllUrlsUseCase {
	constructor(private readonly urlRepository: UrlRepositoryPort) {}

	async execute(): Promise<void> {
		await this.urlRepository.deleteAll();
	}
}
