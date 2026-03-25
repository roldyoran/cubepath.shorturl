import { toast } from "vue-sonner";

/**
 * Composable para copiar texto al portapapeles con notificaciones
 */
export const useCopyToClipboard = () => {
	const copyToClipboard = async (text: string, customMessage?: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(customMessage || "¡Enlace copiado al portapapeles!", {
				description: "El enlace se ha copiado correctamente",
			});
			return true;
		} catch (err) {
			console.error("Error al copiar al portapapeles:", err);
			toast.error("Error al copiar el enlace", {
				description: "No se pudo copiar el enlace al portapapeles",
			});
			return false;
		}
	};

	return {
		copyToClipboard,
	};
};
