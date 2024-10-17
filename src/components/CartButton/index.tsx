'use client'

import { useCart } from '@/hooks/useCart'
import { AnimatePresence, motion } from 'framer-motion'

import s from './s.module.css'
import ShoppingCart from '@/icons/cart-shopping'

export default function Component() {
    const { toggleOpen, getTotalQuantity } = useCart()
    const isCartEmpty = getTotalQuantity() === 0

    return (
        <button
            className={s.cart}
            onClick={toggleOpen}
        >
            <AnimatePresence>
                {
                    !isCartEmpty
                    && <motion.span
                        initial={{ opacity: 0, scale: .25 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className={s.cartCount}
                    >
                        {
                            getTotalQuantity() > 99 ? '99' : getTotalQuantity()
                        }
                    </motion.span>
                }
            </AnimatePresence>
            <ShoppingCart />
        </button>
    )
}