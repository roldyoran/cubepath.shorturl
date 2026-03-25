<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import { Toaster as Sonner } from "vue-sonner";

const props = defineProps<ToasterProps>();
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--success-bg': 'var(--primary)',
      '--success-text': 'var(--primary-foreground)',
      '--success-border': 'var(--primary)',
      '--error-bg': 'var(--destructive)',
      '--error-text': 'var(--destructive-foreground)',
      '--error-border': 'var(--destructive)',
      '--warning-bg': 'var(--accent)',
      '--warning-text': 'var(--accent-foreground)',
      '--warning-border': 'var(--accent)',
      '--info-bg': 'var(--muted)',
      '--info-text': 'var(--muted-foreground)',
      '--info-border': 'var(--border)',
    }"
  />
</template>

<style>
/* Mejorar la legibilidad del texto de descripción en todos los temas */
[data-sonner-toaster] [data-description] {
  color: var(--popover-foreground) !important;
  opacity: 0.8;
}

/* Asegurar que el texto del título sea completamente visible */
[data-sonner-toaster] [data-title] {
  color: var(--popover-foreground) !important;
  opacity: 1;
}

/* Tipografías del proyecto: usar variables definidas en src/style.css */
[data-sonner-toaster] {
  font-family: var(--font-body);
}

[data-sonner-toaster] [data-title] {
  font-family: var(--font-display);
}

/* Mejorar el contraste en modo oscuro */
.dark [data-sonner-toaster] [data-description] {
  opacity: 0.9 !important;
}

/* Estilos para diferentes tipos de toast */
[data-sonner-toaster] [data-type="success"] [data-description] {
  opacity: 0.85;
}

[data-sonner-toaster] [data-type="error"] [data-description] {
  opacity: 0.85;
}

[data-sonner-toaster] [data-type="warning"] [data-description] {
  opacity: 0.85;
}

[data-sonner-toaster] [data-type="info"] [data-description] {
  opacity: 0.85;
}

/* Icono de success (verde según el modo) */
[data-sonner-toaster] [data-type="success"] [data-icon],
[data-sonner-toaster] [data-type="success"] svg {
  color: var(--primary) !important;
  fill: currentColor !important;
  stroke: currentColor !important;
}
</style>
