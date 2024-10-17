'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/useToast'
import s from './styles.module.css'

import Check from '@/icons/circle-check'
import Triangle from '@/icons/triangle-exclamation'

export default function ToastContainer() {
    const { toasts, removeToast } = useToast()
    return (
        <div className={s.toastArea}>
            <AnimatePresence mode='popLayout'>
                {
                    toasts.map((toast) => (
                        <motion.div
                            layout
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            initial={{ opacity: 0, y: -50, scale: 0.3 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: .5, y: 50 }}
                            transition={{ ease: 'linear', duration: .5, type: 'spring' }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 1 }}
                            key={toast.id}
                            className={s.toast}
                            onClick={() => { removeToast(toast.id!) }}
                        >
                            <div className={`${s.icon} ${toast.type === 'success' ? s.successIcon : s.errorIcon}`}>
                                {
                                    toast.type === 'success'
                                        ? <Check />
                                        : <Triangle />
                                }
                            </div>
                            <div className={s.content}>
                                <p className={s.message}>{toast.content}</p>
                            </div>
                        </motion.div>
                    ))
                }
            </AnimatePresence>
        </div >
    )
}