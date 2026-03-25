<template>
  <header class="sticky top-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-md">
    <div class="flex items-center justify-between h-full px-6 gap-4">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-md border border-border bg-card flex items-center justify-center">
          <Link class="w-4 h-4 text-primary" />
        </div>
        <div>
          <span class="font-display font-800 text-[17px] text-foreground tracking-tight">ShortURL</span>
          <span class="block font-mono text-[11px] tracking-wider text-muted-foreground leading-none -mt-0.5">by roldyoran</span>
        </div>
        <div class="w-2 h-2 rounded-full bg-primary animate-pulse ml-1"></div>
      </div>

      <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60">
        <span class="font-mono text-[10px] tracking-wider text-muted-foreground">URLS ACORTADAS</span>
        <span class="font-mono text-[10px] tracking-wider text-primary font-bold">{{ attempts }}</span>
        <div class="w-px h-3 bg-border"></div>
        <span class="font-mono text-[10px] tracking-wider text-muted-foreground">INTENTOS</span>
        <span class="font-mono text-[10px] tracking-wider text-foreground">{{ remainingAttempts }}</span>
      </div>

      <div class="flex-1"></div>

      <div class="flex items-center gap-1">
        <ThemeToggle />

        <Drawer>
          <DrawerTrigger as-child>
            <Button variant="ghost" size="sm" class="sm:hidden w-9 h-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted">
              <Menu class="w-4 h-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader class="text-left">
              <DrawerTitle>Menú</DrawerTitle>
              <DrawerDescription>Opciones de navegación</DrawerDescription>
            </DrawerHeader>
            <div class="px-4 pb-8 space-y-4">
              <Dialog>
                <DialogTrigger as-child>
                  <Button variant="outline" class="w-full justify-start gap-2">
                    <Info class="w-4 h-4" />
                    Información
                  </Button>
                </DialogTrigger>
                <DialogContent class="max-w-2xl">
                  <ApiConfigDialog />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger as-child>
                  <Button variant="outline" class="w-full justify-start gap-2">
                    <User class="w-4 h-4" />
                    Admin
                  </Button>
                </DialogTrigger>
                <DialogContent class="max-w-md">
                  <div class="space-y-4">
                    <Label for="admin-pass-mobile">Contraseña Admin</Label>
                    <Input id="admin-pass-mobile" v-model="adminPassword" type="password" placeholder="Ingresa contraseña" />
                    <div class="flex justify-end">
                      <Button @click="submitAdmin">Iniciar sesión</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" as-child class="w-full justify-start gap-2">
                <a href="https://github.com/roldyoran/shorturl" target="_blank">
                  <Github class="w-4 h-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>

        <Dialog>
          <DialogTrigger as-child>
            <Button variant="ghost" size="sm" class="hidden sm:flex w-9 h-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted">
              <Info class="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-2xl">
            <ApiConfigDialog />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger as-child>
            <Button variant="ghost" size="sm" class="hidden sm:flex items-center gap-1.5 px-3 h-8 text-muted-foreground hover:text-foreground hover:bg-muted">
              <User class="w-3.5 h-3.5" />
              <span class="font-mono text-[10px] tracking-wider">ADMIN</span>
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-md">
            <div class="space-y-4">
              <Label for="admin-pass">Contraseña Admin</Label>
              <Input id="admin-pass" v-model="adminPassword" type="password" placeholder="Ingresa contraseña" />
              <div class="flex justify-end">
                <Button @click="submitAdmin">Iniciar sesión</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" size="sm" as-child class="hidden sm:flex items-center gap-1.5 px-3 h-8 text-muted-foreground hover:text-foreground hover:bg-muted">
          <a href="https://github.com/roldyoran/shorturl" target="_blank">
            <Github class="w-3.5 h-3.5" />
            <span class="font-mono text-[10px] tracking-wider">GITHUB</span>
          </a>
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Link, Info, Github, User, Menu } from "lucide-vue-next";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle.vue";
import ApiConfigDialog from "@/components/config/ApiConfigDialog.vue";
import { ref, computed } from "vue";
import { useUrlStore } from "@/stores/urlStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

defineProps<{
	attempts: number;
}>();

const urlStore = useUrlStore();
const adminPassword = ref("");
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS as string | undefined;
const remainingAttempts = computed(
	() => urlStore.userSession?.remainingAttempts ?? 0,
);

function submitAdmin() {
	if (adminPassword.value === ADMIN_PASS && ADMIN_PASS) {
		urlStore.setAdminStatus(true);
		toast.success("Modo admin activado", {
			description: "Tienes 999 intentos restantes.",
		});
	} else {
		urlStore.setAdminStatus(false);
		toast.error("Contraseña incorrecta", {
			description: "La contraseña admin es incorrecta.",
		});
	}
	adminPassword.value = "";
}
</script>
