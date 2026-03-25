import { AppError } from "@/domain/app-error";
import type { CreateUrlInput, UrlEntity } from "@/domain/url/url.entity";
import type { UrlRepositoryPort } from "@/domain/url/url.repository.port";

export class ShortCodeAlreadyExistsError extends AppError {
	constructor(shortCode: string) {
		super(
			`El shortCode "${shortCode}" ya está en uso`,
			"SHORT_CODE_ALREADY_EXISTS",
		);
	}
}

export class CreateUrlUseCase {
	constructor(private readonly urlRepository: UrlRepositoryPort) {}

	async execute(input: CreateUrlInput): Promise<UrlEntity> {
		const existingByUrl = await this.urlRepository.findByOriginalUrl(
			input.originalUrl,
		);
		if (existingByUrl) {
			return existingByUrl;
		}

		if (input.shortCode) {
			const existing = await this.urlRepository.findByShortCode(
				input.shortCode,
			);
			if (existing) {
				throw new ShortCodeAlreadyExistsError(input.shortCode);
			}
		}

		return this.urlRepository.create(input);
	}
}
