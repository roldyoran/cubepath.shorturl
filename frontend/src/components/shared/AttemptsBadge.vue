<template>
  <span class="font-mono text-[10px] tracking-wider">
    INTENTOS RESTANTES: <span class="text-primary font-bold">{{ attempts }}</span>
  </span>
</template>

<script setup lang="ts">
defineProps<{
	attempts: number;
}>();
</script>
