<template>
  <div>
    <DialogHeader>
      <DialogTitle class="flex items-center gap-3">
        <Info class="w-6 h-6" />
        Información de la API
      </DialogTitle>
      <DialogDescription>
        Información sobre el acortador de URLs
      </DialogDescription>
    </DialogHeader>

    <div class="space-y-6 mt-6">
      <Alert>
        <Info class="w-4 h-4" />
        <AlertTitle>Información</AlertTitle>
        <AlertDescription>
          El acortador de URLs utiliza una clave de API para autenticarse.
          <strong>Puede probar el acortador un máximo de 3 veces.</strong>
        </AlertDescription>
      </Alert>

      <div class="space-y-2">
        <Label for="api-url">URL Base de la API</Label>
        <Input
          id="api-url"
          :modelValue="apiUrl"
          placeholder="https://tu-worker.workers.dev"
          type="url"
          readonly
        />
        <p class="text-xs text-muted-foreground">
          URL configurada para el acortador de enlaces
        </p>
      </div>

      <div class="space-y-3">
        <Label>Documentación del Backend</Label>
        <p class="text-sm text-muted-foreground">
          El backend está desarrollado con <strong>Hono</strong> y <strong>TypeScript</strong>.
          Puedes explorar y probar los endpoints desde:
        </p>
        <div class="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <a :href="`${apiUrl}/docs`" target="_blank">
              <BookOpen class="w-4 h-4 mr-2" />
              Swagger UI
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a :href="`${apiUrl}/scalar`" target="_blank">
              <FileText class="w-4 h-4 mr-2" />
              Scalar
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a :href="`${apiUrl}/openapi.json`" target="_blank">
              <Code class="w-4 h-4 mr-2" />
              OpenAPI JSON
            </a>
          </Button>
        </div>
        <p class="text-xs text-muted-foreground">
          <BookOpen class="w-3 h-3 inline mr-1" />
          <strong>Swagger</strong>: Interfaz visual estilo Swagger para probar endpoints.
          <br />
          <FileText class="w-3 h-3 inline mr-1" />
          <strong>Scalar</strong>: Documentación elegante y minimalista.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Info, BookOpen, FileText, Code } from "lucide-vue-next";
import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiBaseUrl } from "@/api/http";

const apiUrl = getApiBaseUrl();
</script>
