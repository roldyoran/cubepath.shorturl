<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-3 font-display">
        <svg class="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Acortar URL
      </CardTitle>
      <CardDescription v-if="!urlStore.userSession.isAdmin">
        Puede probar el acortador un máximo de 3 veces. Intentos restantes: {{ urlStore.userSession.remainingAttempts }}
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <Alert v-if="!urlStore.canUseService && !urlStore.userSession.isAdmin" variant="destructive" class="bg-red-900/20" role="alert" aria-live="polite">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <AlertTitle class="!text-red-500">Límite alcanzado</AlertTitle>
        <AlertDescription class="!text-red-500">
          Has utilizado todos los intentos disponibles (3/3). Gracias por visitar la página.
        </AlertDescription>
      </Alert>
      <form @submit="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="original-url">URL Original</Label>
          <div class="flex gap-2">
            <div class="relative flex-1 min-w-0">
              <Input
                id="original-url"
                v-model="originalUrl"
                type="url"
                name="original-url"
                autocomplete="url"
                placeholder="https://ejemplo.com/pagina-muy-larga…"
                required
                :disabled="!urlStore.canUseService"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Mostrar u ocultar campo de hash personalizado"
                @click="showHashField = !showHashField"
                class="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'rotate-180': showHashField }" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>
            <Button
              type="submit"
              :disabled="isLoading || !urlStore.canUseService"
            >
              <span v-if="!isLoading">Acortar</span>
              <div v-else class="flex items-center gap-2" aria-live="polite">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Acortando…
              </div>
            </Button>
          </div>
        </div>

        <Transition name="hash-field">
          <div v-if="showHashField" class="space-y-2">
            <Label for="custom-hash">Hash personalizado (opcional)</Label>
            <Input
              id="custom-hash"
              v-model="customHash"
              type="text"
              name="custom-hash"
              autocomplete="off"
              spellcheck="false"
              placeholder="mi-enlace-personalizado…"
              pattern="^[a-zA-Z0-9-_]+$"
            />
            <p class="text-xs text-muted-foreground">Solo se permiten letras, números, guiones y guiones bajos</p>
          </div>
        </Transition>

        <div v-if="error" class="text-destructive text-sm" role="alert" aria-live="polite">
          {{ error }}
        </div>
      </form>

      <div v-if="shortUrl && shortUrl.length > 0" class="space-y-4">
        <Label for="short-url-result">URL acortada</Label>
        <div id="short-url-result" class="flex items-center gap-2 min-w-0">
          <div class="flex-1 min-w-0">
            <code
              class="block font-mono text-sm break-all transition-opacity hover:opacity-90 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-2 py-1"
              tabindex="0"
              role="button"
              :title="urlBase.replace(/\/$/, '') + '/' + shortUrl"
              @click="copyUrl()"
              @keydown.enter.prevent="copyUrl()"
              @keydown.space.prevent="copyUrl()"
            >
              {{ urlBase.replace(/\/$/, '') + '/' + shortUrl }}
            </code>
          </div>
          <Button @click="copyUrl()" variant="outline" size="sm" class="shrink-0" aria-label="Copiar URL acortada">
            <Copy class="w-4 h-4 mr-2" aria-hidden="true" />
            Copiar
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Copy } from "lucide-vue-next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUrlStore } from "@/stores/urlStore";
import { useUrlShortener } from "@/composables/useUrlShortener";
import { useCopyToClipboard } from "@/composables/useCopyToClipboard";
import { getApiBaseUrl } from "@/api/http";

// Store y composables
const urlStore = useUrlStore();
const { shortenUrl, isLoading } = useUrlShortener();
const { copyToClipboard } = useCopyToClipboard();

// Reactive state
const originalUrl = ref<string>("");
const customHash = ref<string>("");
const shortUrl = ref<string>("");
const error = ref<string>("");
const showHashField = ref<boolean>(false);

// Constants
const urlBase = getApiBaseUrl();

// Emits
const emit = defineEmits<{
	"url-shortened": [];
}>();

// Methods
const handleSubmit = async (event: Event) => {
	event.preventDefault();
	error.value = "";
	shortUrl.value = "";

	if (!originalUrl.value.trim()) {
		error.value = "Por favor ingresa una URL.";
		return;
	}

	try {
		const result = await shortenUrl(
			originalUrl.value,
			customHash.value || undefined,
		);

		if (result.success && result.shortUrl) {
			// Usar directamente la URL corta devuelta por la API
			shortUrl.value = result.shortUrl;
			emit("url-shortened");

			// Limpiar formulario
			originalUrl.value = "";
			customHash.value = "";
			showHashField.value = false;
		}
	} catch (err: any) {
		error.value = err.message || "Error inesperado al acortar la URL";
	}
};

const copyUrl = () => {
	const fullUrl = `${urlBase.replace(/\/$/, "")}/${shortUrl.value}`;
	copyToClipboard(fullUrl, "URL copiada al portapapeles");
};
</script>

<style scoped>
/* Animación al mostrar/ocultar la sección de hash personalizado */
.hash-field-enter-active,
.hash-field-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.hash-field-enter-from,
.hash-field-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.hash-field-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
@media (prefers-reduced-motion: reduce) {
  .hash-field-enter-active,
  .hash-field-leave-active {
    transition-duration: 0.01s;
  }
}
</style>