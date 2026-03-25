import { beforeEach, describe, expect, it } from "bun:test";
import { DeleteAllUrlsUseCase } from "@/application/url/delete-all-urls.usecase";
import {
	createMockRepository,
	type MockedRepository,
} from "../../../__mocks__/url.repository.mock";

describe("DeleteAllUrlsUseCase", () => {
	let repo: MockedRepository;
	let useCase: DeleteAllUrlsUseCase;

	beforeEach(() => {
		repo = createMockRepository();
		useCase = new DeleteAllUrlsUseCase(repo);
	});

	it("debe llamar a deleteAll en el repositorio", async () => {
		await useCase.execute();

		expect(repo.deleteAll).toHaveBeenCalledTimes(1);
	});

	it("debe completar sin errores", async () => {
		const promise = useCase.execute();

		expect(promise).resolves.toBeUndefined();
	});
});
