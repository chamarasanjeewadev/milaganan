import { useToast as useToastOriginal } from "@/components/ui/toast"

export interface Toast {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export interface UseToast {
  toast: (props: Toast) => void
}

export const useToast = (): UseToast => {
  const { toast } = useToastOriginal()
  return { toast }
} 