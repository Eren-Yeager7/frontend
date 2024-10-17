'use client'

import React, { useState, useLayoutEffect, MouseEvent } from 'react'
import s from './styles.module.css'

const useDebouncedRippleCleanUp = (
    rippleCount: number,
    duration: number,
    cleanUpFunction: () => void
) => {
    useLayoutEffect(() => {
        let bounce: number | null = null;
        if (rippleCount > 0) {
            if (bounce) {
                clearTimeout(bounce)
            }
            bounce = window.setTimeout(() => {
                cleanUpFunction()
                if (bounce) {
                    clearTimeout(bounce)
                }
            }, duration * 4)
        }
        return () => {
            if (bounce) {
                clearTimeout(bounce)
            }
        }
    }, [rippleCount, duration, cleanUpFunction])
}

interface RippleState {
    x: number
    y: number
    size: number
}

const Ripple = () => {
    const [rippleArray, setRippleArray] = useState<RippleState[]>([])
    useDebouncedRippleCleanUp(rippleArray.length, 500, () => {
        setRippleArray([])
    })

    const addRipple = (event: MouseEvent<HTMLDivElement>) => {
        const rippleContainer = event.currentTarget.getBoundingClientRect()
        const size = rippleContainer.width > rippleContainer.height
            ? rippleContainer.width
            : rippleContainer.height
        const x = event.clientX - rippleContainer.left - size / 2
        const y = event.clientY - rippleContainer.top - size / 2
        const newRipple = { x, y, size }

        setRippleArray([...rippleArray, newRipple])
    }

    return (
        <div
            className={s.ripple}
            onMouseDown={addRipple}
        >
            {rippleArray.length > 0 &&
                rippleArray.map((ripple, index) => (
                    <span
                        key={`span${index}`}
                        style={{
                            top: ripple.y,
                            left: ripple.x,
                            width: ripple.size,
                            height: ripple.size,
                        }}
                    />
                ))}
        </div>
    )
}

export default React.memo(Ripple)