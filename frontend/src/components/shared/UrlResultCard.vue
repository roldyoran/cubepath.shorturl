<template>
  <Card class="result-card rounded-2xl p-4 mt-3" :class="animating ? 'focus-card' : ''">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        <span class="font-mono text-[10px] tracking-wider text-primary">URL ACORTADA EXITOSAMENTE</span>
      </div>
      <Button variant="ghost" size="sm" class="h-6 w-6 p-0" @click="$emit('close')">
        <X class="w-4 h-4" />
      </Button>
    </div>

    <div class="flex items-center gap-2 mt-3">
      <div class="flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5 bg-card border border-primary/20">
        <Link class="w-4 h-4 flex-shrink-0 text-primary" />
        <span class="font-mono text-xs text-primary truncate">{{ shortUrl }}</span>
      </div>
      <Button variant="outline" size="sm" @click="$emit('copy')" class="h-10 px-3 font-mono text-[10px] tracking-wider">
        <Copy class="w-3.5 h-3.5 mr-1.5" />
        COPIAR
      </Button>
      <Button variant="outline" size="sm" as-child class="h-10 w-10 p-0">
        <a :href="shortUrl" target="_blank" rel="noopener noreferrer" aria-label="Abrir URL acortada">
          <ExternalLink class="w-3.5 h-3.5" />
        </a>
      </Button>
    </div>

    <div v-if="originalUrl" class="mt-3">
      <Label class="font-mono text-[10px] text-muted-foreground">URL ORIGINAL</Label>
      <div class="font-mono text-xs text-foreground/70 truncate">{{ originalUrl }}</div>
    </div>

    <div class="flex items-center gap-4 pt-3 border-t border-border">
      <div class="flex items-center gap-1.5">
        <Eye class="w-3 h-3 text-muted-foreground" />
        <span class="font-mono text-[10px] text-muted-foreground">0 CLICS</span>
      </div>
      <div class="flex items-center gap-1.5">
        <Clock class="w-3 h-3 text-muted-foreground" />
        <span class="font-mono text-[10px] text-muted-foreground">HACE UN MOMENTO</span>
      </div>
      <div class="flex items-center gap-1.5 ml-auto">
        <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
        <span class="font-mono text-[10px] text-primary">EDGE ACTIVO</span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Link, ExternalLink, Copy, X, Eye, Clock } from "lucide-vue-next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

defineProps<{
	shortUrl: string;
	originalUrl?: string;
	animating?: boolean;
}>();

defineEmits<{
	copy: [];
	close: [];
}>();
</script>

<style scoped>
.result-card {
	border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
	background: var(--card);
}

.focus-card {
	animation: focusIn 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
	z-index: 30;
}

@keyframes focusIn {
	0% {
		transform: translateY(8px) scale(0.995);
		box-shadow: 0 0 0 rgba(0, 0, 0, 0);
	}
	40% {
		transform: translateY(-6px) scale(1.02);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
	}
	100% {
		transform: translateY(0) scale(1);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
	}
}
</style>
