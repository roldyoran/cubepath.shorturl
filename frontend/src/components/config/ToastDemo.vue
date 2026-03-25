<script setup lang="ts">
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";

const simulateAsyncOperation = (): Promise<string> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve("URL acortada"), 2000);
	});
};

const handlePromiseToast = () => {
	const promise = simulateAsyncOperation();
	toast.promise(promise, {
		loading: "Acortando URL...",
		success: "URL acortada correctamente",
		error: "Error al acortar URL",
	});
};
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Sonner Test</h3>
    <div class="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        @click="() => {
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }"
      >
        Basic Toast
      </Button>

      <Button
        variant="outline"
        @click="() => toast.success('URL acortada correctamente', {
          description: 'Tu nueva URL está lista para usar',
        })"
      >
        Success Toast
      </Button>

      <Button
        variant="outline"
        @click="() => toast.error('Error al acortar URL', {
          description: 'Por favor, verifica la URL e inténtalo de nuevo',
        })"
      >
        Error Toast
      </Button>

      <Button
        variant="outline"
        @click="handlePromiseToast"
      >
        Promise Toast
      </Button>
    </div>
  </div>
</template>
