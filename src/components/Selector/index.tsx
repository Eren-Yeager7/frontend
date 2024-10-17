'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

import ChevronUpDown from '@/icons/up-down'

import s from './styles.module.css'

interface ISetupOption {
    type: number,
    label: string
}

export default function Selector({ selected, setSelected, options }: {
    selected: ISetupOption,
    options: ISetupOption[],
    setSelected: React.Dispatch<React.SetStateAction<ISetupOption>>
}) {
    const [open, setOpen] = useState(false)
    function toggleOpen() { setOpen(prev => !prev) }
    const ref = useRef<HTMLUListElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
                return
            }
            if (ref && ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return () => { document.removeEventListener('mousedown', handleOutsideClick) }
    }, [ref])
    return (
        <button
            ref={buttonRef}
            onClick={toggleOpen}
            className={`${s.selector} ${open && s.open}`}
        >
            <span>{selected.label}</span>
            <span className={s.upDownChevron}>
                <ChevronUpDown />
            </span>
            <AnimatePresence>
                {
                    open &&
                    <motion.ul
                        ref={ref}
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={s.listOptions}>
                        {
                            options.map((option, index) => (
                                <li
                                    key={index}
                                    onClick={() => setSelected(option)}
                                    className={s.listOption}
                                >
                                    {option.label}
                                </li>
                            ))
                        }
                    </motion.ul>
                }
            </AnimatePresence>
        </button>
    )
}