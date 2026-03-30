<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
	BookOpen,
	ChevronDown,
	ExternalLink,
	FileText,
	Github,
	Link as LinkIcon,
	Server,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ThemeToggle from "@/components/layout/ThemeToggle.vue";
import { getApiBaseUrl } from "@/api/http";

const isDocsCardOpen = ref(false);
const docsContainerRef = ref<HTMLElement | null>(null);

const backendBaseUrl = computed(() => getApiBaseUrl());
const backendDocsLinks = computed(() => [
	{
		label: "Swagger UI",
		path: "/docs",
		description: "Interfaz principal para explorar y probar endpoints.",
	},
	{
		label: "Scalar API Reference",
		path: "/scalar",
		description: "Referencia moderna y amigable de la API.",
	},
]);

function toAbsoluteUrl(path: string) {
	return new URL(path, backendBaseUrl.value).toString();
}

function toggleDocsCard() {
	isDocsCardOpen.value = !isDocsCardOpen.value;
}

function closeDocsCard() {
	isDocsCardOpen.value = false;
}

function handleDocumentClick(event: MouseEvent) {
	if (!isDocsCardOpen.value) {
		return;
	}

	const target = event.target;
	if (!(target instanceof Node)) {
		return;
	}

	if (docsContainerRef.value?.contains(target)) {
		return;
	}

	closeDocsCard();
}

onMounted(() => {
	document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleDocumentClick);
});
</script>

<template>
	<header
		class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"
	>
		<div class="container mx-auto h-16 px-4">
			<div class="flex h-full items-center justify-between gap-3">
				<a
					href="/"
					class="group inline-flex items-center gap-2.5"
					aria-label="Ir al inicio"
				>
					<div
						class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105"
					>
						<LinkIcon class="h-4 w-4" aria-hidden="true" />
					</div>
					<div class="leading-tight">
						<p class="text-sm font-semibold font-display">
							ShortURL
							<span class="ml-2 text-xs font-mono text-muted-foreground">
								by roldyoran
							</span>
						</p>
						<p class="text-xs font-mono text-muted-foreground">CUBEPATH</p>
					</div>
				</a>

				<nav class="relative flex items-center gap-2" aria-label="Navegación principal">
					<div ref="docsContainerRef" class="relative">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							class="h-8 px-2 text-xs sm:px-3"
							aria-haspopup="dialog"
							:aria-expanded="isDocsCardOpen"
							@click="toggleDocsCard"
						>
							<FileText class="h-4 w-4" aria-hidden="true" />
							<span class="hidden sm:inline text-xs font-mono">Docs Backend</span>
							<ChevronDown
								class="h-4 w-4 transition-transform duration-200"
								:class="isDocsCardOpen ? 'rotate-180' : ''"
								aria-hidden="true"
							/>
						</Button>

						<Transition name="docs-card">
							<div
								v-if="isDocsCardOpen"
								class="absolute right-0 top-12 z-50 w-[min(92vw,420px)]"
							>
								<Card class="shadow-md">
									<CardHeader>
										<CardTitle class="flex items-center gap-2 text-base">
											<BookOpen class="h-4 w-4 text-primary" />
											Documentación del Backend
										</CardTitle>
										<CardDescription>
											Aquí puedes explorar cómo funciona la API del acortador, probar
											endpoints y revisar su especificación.
										</CardDescription>
									</CardHeader>

									<CardContent class="space-y-4">
										<div class="rounded-md border bg-muted/40 p-3">
											<div class="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
												<Server class="h-3.5 w-3.5" />
												<span>Backend base URL</span>
											</div>
											<a
												:href="backendBaseUrl"
												target="_blank"
												rel="noopener noreferrer"
												class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline break-all"
											>
												{{ backendBaseUrl }}
												<ExternalLink class="h-3.5 w-3.5" />
											</a>
										</div>

										<div class="space-y-2">
											<p class="text-xs font-medium text-muted-foreground">
												Elige la vista de documentación que prefieras:
											</p>
											<ul class="space-y-2">
												<li
													v-for="link in backendDocsLinks"
													:key="link.path"
													class="rounded-md border p-3"
												>
													<div class="flex items-start justify-between gap-2">
														<div class="min-w-0">
															<a
																:href="toAbsoluteUrl(link.path)"
																target="_blank"
																rel="noopener noreferrer"
																class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
															>
																{{ link.label }}
																<ExternalLink class="h-3.5 w-3.5" />
															</a>
															<p class="mt-1 text-xs text-muted-foreground">
																{{ link.description }}
															</p>
															<p class="mt-1 text-xs text-muted-foreground break-all">
																{{ toAbsoluteUrl(link.path) }}
															</p>
														</div>
													</div>
												</li>
											</ul>
										</div>


									</CardContent>
								</Card>
							</div>
						</Transition>
					</div>

					<Button as-child variant="ghost" size="sm" class="h-8 px-2 text-xs sm:px-3">
						<a
							href="https://github.com/roldyoran/cubepath.shorturl"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Abrir perfil de GitHub"
							title="GitHub"
							class="inline-flex items-center gap-2"
						>
							<Github class="h-4 w-4" />
							<span class="hidden sm:inline text-xs font-mono">GitHub</span>
						</a>
					</Button>

					<ThemeToggle />
				</nav>
			</div>
		</div>
	</header>
</template>

<style scoped>
.docs-card-enter-active,
.docs-card-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
	transform-origin: top right;
}

.docs-card-enter-from,
.docs-card-leave-to {
	opacity: 0;
	transform: translateY(-8px) scale(0.98);
}
</style>
