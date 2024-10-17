import { create } from 'zustand'

type Toast = {
    id?: number
    type: string
    content: string
}

type ToastStore = {
    toasts: Toast[]
    showToast: (toast: Toast) => void
    removeToast: (id: number) => void
    clearToasts: () => void
}

export const useToast = create<ToastStore>((set) => ({
    toasts: [],
    showToast: (toast: Toast) => {
        const id = Date.now()
        set((state) => ({
            toasts: [{ ...toast, id }, ...state.toasts.slice(0, 2)]
        }))
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter(toast => toast.id !== id)
            }))
        }, 5000)
    },
    removeToast: (id: number) => {
        set((state) => ({
            toasts: state.toasts.filter(toast => toast.id !== id)
        }))
    },
    clearToasts: () => {
        set(() => ({ toasts: [] }))
    }
}))