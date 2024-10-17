'use client'

import { create } from 'zustand'
import s from './styles.module.css'
import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Modal = {
    open: boolean
    children: ReactNode[]
    showModal: (child: ReactNode) => void
    closeModal: () => void;
    closeAllModals: () => void
}

export const useModal = create<Modal>((set) => ({
    open: false,
    children: [],
    showModal: (newChild) => {
        set((state) => {
            const updatedChildren = [...state.children, newChild]
            return {
                open: true,
                children: updatedChildren,
            }
        })
    },
    closeModal: () => {
        set((state) => {
            const updatedChildren = [...state.children]
            updatedChildren.pop()

            return {
                open: updatedChildren.length > 0,
                children: updatedChildren,
            }
        })
    },
    closeAllModals: () => {
        set({ open: false, children: [] })
    }
}))

export function ModalContainer() {
    const { children, open } = useModal()
    const active = open && children.length > 0

    useEffect(() => {
        const handleEscKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                close();
            }
        }

        if (active) {
            document.addEventListener('keydown', handleEscKeyPress)
        }

        const hasScrollbar = window.innerWidth > document.documentElement.clientWidth
        if (active) {
            if (hasScrollbar) {
                document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
            }
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
            document.body.style.paddingRight = '0'
        }

        return () => {
            document.removeEventListener('keydown', handleEscKeyPress)
            document.body.style.overflow = 'auto'
            document.body.style.paddingRight = '0'
        };
    }, [active, close])

    return (
        <AnimatePresence mode='wait'>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={s.backdrop}
                >
                    {children[children.length - 1]}
                </motion.div>
            )}
        </AnimatePresence>
    )
}