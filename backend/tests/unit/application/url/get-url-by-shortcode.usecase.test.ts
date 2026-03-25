import { beforeEach, describe, expect, it, mock } from "bun:test";
import { GetUrlByShortCodeUseCase } from "@/application/url/get-url-by-shortcode.usecase";
import {
	createMockRepository,
	type MockedRepository,
	urlFixture,
} from "../../../__mocks__/url.repository.mock";

describe("GetUrlByShortCodeUseCase", () => {
	let repo: MockedRepository;
	let useCase: GetUrlByShortCodeUseCase;

	beforeEach(() => {
		repo = createMockRepository();
		useCase = new GetUrlByShortCodeUseCase(repo);
	});

	it("debe retornar la URL cuando el shortCode existe", async () => {
		repo.findByShortCode = () => Promise.resolve(urlFixture);

		const result = await useCase.execute("hono");

		expect(result).toEqual(urlFixture);
	});

	it("debe retornar null cuando el shortCode no existe", async () => {
		repo.findByShortCode = () => Promise.resolve(null);

		const result = await useCase.execute("noexiste");

		expect(result).toBeNull();
	});

	it("debe llamar al repositorio con el shortCode correcto", async () => {
		repo.findByShortCode = mock(() => Promise.resolve(null));

		await useCase.execute("abc123");

		expect(repo.findByShortCode).toHaveBeenCalledWith("abc123");
		expect(repo.findByShortCode).toHaveBeenCalledTimes(1);
	});
});
