import { beforeEach, describe, expect, it, mock } from "bun:test";
import { RedirectUrlUseCase } from "@/application/url/redirect-url.usecase";
import {
	createMockRepository,
	type MockedRepository,
	urlFixture,
} from "../../../__mocks__/url.repository.mock";

describe("RedirectUrlUseCase", () => {
	let repo: MockedRepository;
	let useCase: RedirectUrlUseCase;

	beforeEach(() => {
		repo = createMockRepository();
		useCase = new RedirectUrlUseCase(repo);
	});

	it("debe retornar la URL actualizada cuando el shortCode existe", async () => {
		const urlWithVisit = { ...urlFixture, visits: 1 };
		repo.findByShortCode = mock(() => Promise.resolve(urlFixture));
		repo.incrementVisits = mock(() => Promise.resolve(urlWithVisit));

		const result = await useCase.execute("hono");

		expect(result).toEqual(urlWithVisit);
	});

	it("debe retornar null cuando el shortCode no existe", async () => {
		repo.findByShortCode = mock(() => Promise.resolve(null));

		const result = await useCase.execute("noexiste");

		expect(result).toBeNull();
	});

	it("no debe llamar a incrementVisits si el shortCode no existe", async () => {
		repo.findByShortCode = mock(() => Promise.resolve(null));
		repo.incrementVisits = mock(() => Promise.resolve(null));

		await useCase.execute("noexiste");

		expect(repo.incrementVisits).not.toHaveBeenCalled();
	});

	it("debe llamar a findByShortCode e incrementVisits con el shortCode correcto", async () => {
		const urlWithVisit = { ...urlFixture, visits: 1 };
		repo.findByShortCode = mock(() => Promise.resolve(urlFixture));
		repo.incrementVisits = mock(() => Promise.resolve(urlWithVisit));

		await useCase.execute("hono");

		expect(repo.findByShortCode).toHaveBeenCalledWith("hono");
		expect(repo.incrementVisits).toHaveBeenCalledWith("hono");
	});
});
