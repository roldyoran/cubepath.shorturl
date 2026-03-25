<template>
  <section class="relative min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4 pt-6 pb-10 sm:pt-0 sm:pb-8 overflow-hidden">
    <div class="hero-tag flex items-center gap-2 mb-6">
      <Badge variant="secondary" class="text-xs font-medium">
        <img src="/cubepath.svg" class="w-4 h-4 mr-1 inline dark:brightness-0 dark:invert" alt="CUBEPATH" />
        Powered by CUBEPATH VPS
      </Badge>
    </div>

    <h1 class="hero-h1 font-display font-extrabold text-center leading-[1.0] mb-3 tracking-tight w-full max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
      Acorta tu URL<br/>
      <span class="text-primary">al instante.</span>
    </h1>

    <p class="hero-sub font-body text-center mb-4 max-w-md text-sm sm:text-base text-muted-foreground">
      Simple · Rápido · Gratis · Construido sobre infraestructura de CUBEPATH
    </p>

    <div class="hero-svc flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-6 mt-1">
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card/80 border-border">
        <svg class="w-3 h-3 flex-shrink-0 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
        </svg>
        <span class="font-mono text-xs text-foreground">{{ SERVICE_URL }}</span>
      </div>
      <Tooltip>
        <TooltipTrigger :asChild="true">
          <Button
            variant="outline"
            size="sm"
            class="h-8 w-8 p-0"
            @click="copyServiceUrl"
            aria-label="Copiar URL del servicio"
          >
            <Copy class="w-3.5 h-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copiar URL del servicio</TooltipContent>
      </Tooltip>
    </div>

    <div class="hero-card w-full" style="max-width:680px">
      <Card class="rounded-2xl p-4 sm:p-5">
        <div class="flex items-center justify-between mb-2">
          <Label class="font-mono text-[10px] tracking-wider flex items-center gap-1.5 text-foreground">
            <svg class="w-3 h-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            URL ORIGINAL
          </Label>
          <AttemptsBadge :attempts="attempts" />
        </div>

        <form @submit.prevent="handleShorten" class="flex flex-col sm:flex-row gap-2 mb-2.5">
          <Input
            v-model="urlInput"
            type="url"
            placeholder="https://ejemplo.com/pagina-muy-larga/con-parametros-largos..."
            class="flex-1 rounded-xl px-4 py-3 text-sm font-mono"
            @keydown.enter.prevent="handleShorten"
            :disabled="!urlStore.canUseService"
          />
          <Button
            type="submit"
            :disabled="isLoading || !urlStore.canUseService"
            class="px-6 py-3 rounded-xl text-sm whitespace-nowrap w-full sm:w-auto"
          >
            <span v-if="!isLoading">Acortar →</span>
            <div v-else class="flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Procesando
            </div>
          </Button>
        </form>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-x-5">
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="customAlias = !customAlias"
              class="w-9 h-5 rounded-full toggle-track flex items-center px-0.5"
              :class="customAlias ? 'active' : ''"
            >
              <div class="w-4 h-4 rounded-full toggle-thumb" :class="customAlias ? 'active' : ''"></div>
            </button>
            <span class="font-mono text-[10px] tracking-wider text-foreground">ALIAS PERSONALIZADO</span>
          </div>

          <div class="w-full sm:flex-1 min-w-[140px] alias-field" :class="customAlias ? 'alias-field--open' : ''">
            <Input
              type="text"
              v-model="alias"
              @input="onAliasInput"
              @keydown.enter.prevent="handleShorten"
              maxlength="9"
              pattern="[a-z0-9]*"
              inputmode="text"
              placeholder="alias - máximo 9 caracteres (a-z0-9)"
              class="w-full rounded-lg px-3 py-1.5 text-sm font-mono"
            />
          </div>
        </div>
      </Card>

      <UrlResultCard
        v-if="shortUrl"
        ref="resultCard"
        :shortUrl="shortUrl"
        :originalUrl="originalUrl"
        :animating="cardAnimating"
        :closing="isClosing"
        @copy="copyShortUrl"
        @close="handleCloseCard"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Copy } from "lucide-vue-next";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import UrlResultCard from "@/components/shared/UrlResultCard.vue";
import AttemptsBadge from "@/components/shared/AttemptsBadge.vue";
import { useUrlStore } from "@/stores/urlStore";
import { useUrlShortener } from "@/composables/useUrlShortener";
import { useCopyToClipboard } from "@/composables/useCopyToClipboard";
import { getApiBaseUrl } from "@/api/http";
import { toast } from "vue-sonner";
import { z } from "zod";
import confetti from "canvas-confetti";

const urlStore = useUrlStore();
const { shortenUrl, isLoading } = useUrlShortener();
const { copyToClipboard } = useCopyToClipboard();

const SERVICE_URL = getApiBaseUrl();

const urlInput = ref("");
const alias = ref("");
const originalUrl = ref("");
const resultCard = ref<HTMLElement | null>(null);
const cardAnimating = ref(false);
const isClosing = ref(false);

const onAliasInput = (e: Event) => {
	const val = (e.target as HTMLInputElement).value || "";
	alias.value = val.replace(/[^a-z0-9]/g, "").slice(0, 9);
};

const handleCloseCard = async () => {
	isClosing.value = true;
	await new Promise((resolve) => setTimeout(resolve, 400));
	shortUrl.value = "";
	originalUrl.value = "";
	isClosing.value = false;
};

const customAlias = ref(false);
const shortUrl = ref("");

const attempts = computed(() => urlStore.userSession.remainingAttempts);

const urlSchema = z
	.string()
	.nonempty({ message: "Ingresa una URL" })
	.url({ message: "Ingresa una URL válida" })
	.refine((val) => /^https?:\/\//i.test(val), {
		message: "Solo se permiten URLs con protocolo http(s)",
	});

const fireConfetti = () => {
	confetti({
		particleCount: 80,
		spread: 70,
		origin: { x: 0, y: 0.6 },
		angle: 60,
	});
	confetti({
		particleCount: 80,
		spread: 70,
		origin: { x: 1, y: 0.6 },
		angle: 120,
	});
	confetti({
		particleCount: 80,
		spread: 70,
		origin: { y: 0.6 },
	});
};

const handleShorten = async () => {
	const raw = (urlInput.value || "").trim();
	if (!urlStore.canUseService) return;

	const parsed = urlSchema.safeParse(raw);
	if (!parsed.success) {
		const first = parsed.error.issues?.[0];
		toast.error(first?.message ?? "URL inválida");
		return;
	}

	const original = parsed.data;

	try {
		const result = await shortenUrl(original, alias.value || undefined);

		if (result.success) {
			shortUrl.value =
				(result as { shortUrl?: string; shortCode?: string }).shortUrl ??
				`${SERVICE_URL}/${(result as { shortCode?: string }).shortCode ?? result.shortUrl}`;
			originalUrl.value =
				(result as { originalUrl?: string }).originalUrl ?? original;
			urlInput.value = "";
			alias.value = "";
			customAlias.value = false;

			await nextTick();

			cardAnimating.value = true;
			const el =
				(resultCard.value as unknown as { $el?: HTMLElement })?.$el ??
				resultCard.value;
			if (el && typeof el.scrollIntoView === "function") {
				el.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			setTimeout(() => (cardAnimating.value = false), 600);

			fireConfetti();
		}
	} catch (err: unknown) {
		toast.error(
			(err as { message?: string })?.message || "Error al acortar la URL",
		);
	}
};

const copyServiceUrl = () => {
	copyToClipboard(SERVICE_URL, "URL del servicio copiada");
};

const copyShortUrl = () => {
	copyToClipboard(shortUrl.value, "URL copiada al portapapeles");
};
</script>

<style scoped>
.toggle-track {
	background: var(--muted);
	border: 1px solid var(--border);
	transition: background 0.2s;
}

.toggle-track.active {
	background: color-mix(in srgb, var(--primary) 20%, transparent);
	border-color: color-mix(in srgb, var(--primary) 40%, transparent);
}

.toggle-thumb {
	background: var(--muted-foreground);
	transition: transform 0.2s, background 0.2s;
}

.toggle-thumb.active {
	background: var(--primary);
	transform: translateX(16px);
}

.alias-field {
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.2s ease;
}

.alias-field--open {
	max-height: 80px;
}

@media (min-width: 640px) {
	.alias-field {
		max-height: none;
		overflow: visible;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s ease;
	}

	.alias-field--open {
		opacity: 1;
		pointer-events: auto;
	}
}

.hero-tag {
	animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
}

.hero-h1 {
	animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
}

.hero-sub {
	animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both;
}

.hero-svc {
	animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

.hero-card {
	animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.38s both;
}

@keyframes slideUp {
	0% {
		opacity: 0;
		transform: translateY(20px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

@media (prefers-reduced-motion: reduce) {
	.hero-tag,
	.hero-h1,
	.hero-sub,
	.hero-svc,
	.hero-card {
		animation: none;
		opacity: 1;
		transform: none;
	}
}
</style>
