import { create } from 'zustand'
import { useEffect } from 'react'

interface CartItem {
    id: number
    img: string
    name: string
    price: number
    quantity: number
    description: string
    setupOption: number
}

interface CartStore {
    isOpen: boolean
    cart: CartItem[]

    open: () => void
    close: () => void
    toggleOpen: () => void
    addToCart: (item: CartItem) => void
    removeFromCart: (id: number, setupOption: number) => void
    clearCart: () => void
    setCart: (cart: CartItem[]) => void

    getTotalQuantity: () => number
    getTotalPrice: () => number
    getRawPrice: () => number
    getSetupOptionsTotal: () => number
}

const setupOptionPrices: { [key: number]: number } = {
    5: 30,
    10: 50,
}

export const useCart = create<CartStore>((set, get) => ({
    isOpen: false,
    cart: (() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    })(),

    open: () => { set({ isOpen: true }) },
    close: () => { set({ isOpen: false }) },
    toggleOpen: () => { set({ isOpen: !get().isOpen }) },

    addToCart: (newItem: CartItem) => {
        const { cart } = get()

        const existingItemIndex = cart.findIndex(item =>
            item.id === newItem.id && item.setupOption === newItem.setupOption
        )

        let updatedCart
        if (existingItemIndex > -1) {
            updatedCart = cart.map((item, index) => {
                if (index === existingItemIndex) {
                    return {
                        ...item,
                        quantity: item.quantity + (newItem.quantity || 1),
                    }
                }
                return item
            })
        } else {
            updatedCart = [{ ...newItem, quantity: newItem.quantity || 1 }, ...cart]
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart))
        set({ cart: updatedCart })
    },

    removeFromCart: (id: number, setupOption: number) => {
        const { cart } = get()
        const updatedCart = cart.filter(item => !(item.id === id && item.setupOption === setupOption))
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        set({ cart: updatedCart })
    },

    clearCart: () => {
        localStorage.removeItem('cart')
        set({ cart: [] })
    },

    setCart: (cart: CartItem[]) => {
        set({ cart })
    },

    getTotalQuantity: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + item.quantity, 0)
    },

    getTotalPrice: () => {
        const cart = get().cart

        return cart.reduce((total, item) => {
            const itemPrice = item.price * item.quantity
            const setupOptionPrice = item.setupOption ? (setupOptionPrices[item.setupOption] || 0) * item.quantity : 0
            return (total + itemPrice + setupOptionPrice) * 1.2
        }, 0)
    },

    getRawPrice: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    },

    getSetupOptionsTotal: () => {
        const { cart } = get()
        return cart.reduce((total, item) => {
            const setupPrice = item.setupOption ? setupOptionPrices[item.setupOption] || 0 : 0
            return total + setupPrice * item.quantity
        }, 0)
    }
}))


export function useCartSync() {
    const setCart = useCart(state => state.setCart)

    useEffect(() => {
        function handleStorageChange() {
            const updatedCart = JSON.parse(window.localStorage.getItem('cart') || '[]')
            setCart(updatedCart)
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [setCart])
}