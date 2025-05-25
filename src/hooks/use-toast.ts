
import { useToast as useToastImpl, toast as toastImpl } from "@/components/ui/use-toast";

// Re-export the hook and functions
export const useToast = useToastImpl;
export const toast = toastImpl;
