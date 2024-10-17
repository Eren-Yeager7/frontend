'use client'

import { useEffect } from 'react'

export default function useLockBodyScroll(shouldLock: boolean) {
    useEffect(() => {
        if (shouldLock) {
            const hasScrollbar = window.innerWidth > document.documentElement.clientWidth
            if (hasScrollbar) {
                document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
            }
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
            document.body.style.paddingRight = '0'
        }

        return () => {
            document.body.style.overflow = 'auto'
            document.body.style.paddingRight = '0'
        }
    }, [shouldLock])
}