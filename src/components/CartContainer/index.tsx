'use client'

import ReactDOM from 'react-dom'
import { formatCurrency } from '@/util'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useModal } from '@/hooks/useModal'
import { useCartSync } from '@/hooks/useCart'
import { motion } from 'framer-motion'
import useLockBodyScroll from '@/hooks/useLockBodyScroll'

import s from './s.module.css'
import Trash from '@/icons/trash'
import XMark from '@/icons/xmark'
import Bag from '@/icons/bag-shopping'
import Cart from '@/icons/cart-shopping'
import ArrowRight from '@/icons/arrow-right'

interface ICartItem {
    id: number
    img: string
    name: string
    price: number
    quantity: number
    description: string
    setupOption: number
}

import CircleCheck from '@/icons/circle-check'

function getRandomNumber(length: number): string {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, length)).toString()
    return randomNumber.padStart(length, '0')
}

function ReceiptModal({ name, value }: { name: string, value: string }) {
    const { closeAllModals } = useModal()
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeAllModals()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [closeAllModals])

    return (
        <motion.div
            ref={modalRef}
            className={s.modal}
            transition={{
                duration: 0.5,
                type: 'spring',
                ease: 'easeInOut',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
        >
            <div className={s.modalHeading}>
                <div className={s.icon}>
                    <CircleCheck />
                </div>
                <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold'
                }}>Order Success!</p>
                <span
                    style={{
                        color: 'var(--textSecondary)'
                    }}
                >
                    Your order was successfully done.
                </span>
            </div>

            <div
                className={s.modalBody}
                style={{
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}
            >
                <div className={s.infoItem}>
                    <span className={s.label}>
                        Receipt ID
                    </span>
                    <span>{getRandomNumber(12)}</span>
                </div>
                <div className={s.infoItem}>
                    <span className={s.label}>
                        Payment Method
                    </span>
                    <span>Bank Transfer</span>
                </div>
                <div className={s.infoItem}>
                    <span className={s.label}>
                        Payment Time
                    </span>
                    <span>{getCurrentTime()}</span>
                </div>
                <div className={s.infoItem}>
                    <span className={s.label}>
                        Company Name
                    </span>
                    <span>{name}</span>
                </div>
                <div className={s.amount}>
                    <span>
                        Amount
                    </span>
                    <span>{value}</span>
                </div>
            </div>
        </motion.div>
    )
}

function getCurrentTime(): string {
    const padZero = (num: number): string => num.toString().padStart(2, '0')

    const date = new Date()

    const day = padZero(date.getDate())
    const month = padZero(date.getMonth() + 1)
    const year = date.getFullYear()

    const hours = padZero(date.getHours())
    const minutes = padZero(date.getMinutes())
    const seconds = padZero(date.getSeconds())

    return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`
}


function OverviewModal({ name, value }: { name: string, value: string }) {
    const { closeModal, showModal } = useModal()
    const modalRef = useRef<HTMLDivElement>(null)
    const { cart, clearCart, getRawPrice, getSetupOptionsTotal } = useCart()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [closeModal])

    return (
        <motion.div
            ref={modalRef}
            className={s.modal}
            transition={{
                duration: 0.5,
                type: 'spring',
                ease: 'easeInOut',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
        >
            <div className={s.heading}>
                <p style={{
                    fontWeight: 'bold',
                    fontSize: '2rem'
                }}>
                    Overview
                </p>
                <span
                    style={{
                        color: 'var(--textSecondary)'
                    }}
                >
                    Review your cart before confirming your order
                </span>
            </div>

            <div
                className={s.body}
                style={{
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}
            >
                <div
                    className={s.cartContent}
                    style={{
                        overflowX: 'hidden',
                        maxHeight: '15rem',
                        padding: '0',
                    }}
                >
                    {
                        cart.map((item, index) => (
                            <CartItem canRemove={false} item={item} delay={index * .05} key={item.id} />
                        ))
                    }
                </div>
                <div
                    className={s.cartTotal}
                    style={{
                        padding: '0'
                    }}
                >
                    <div className={s.row}>
                        <div className={s.label}>
                            Subtotal
                        </div>
                        <div className={s.value}>
                            {formatCurrency(getRawPrice())}
                        </div>
                    </div>

                    <div className={s.row}>
                        <div className={s.label}>
                            Set-up options
                        </div>
                        <div className={s.value}>
                            {formatCurrency(getSetupOptionsTotal())}
                        </div>
                    </div>

                    <div className={s.row}>
                        <div className={s.label}>
                            Taxes (+20%)
                        </div>
                        <div className={s.value}>
                            {(formatCurrency((getRawPrice() + getSetupOptionsTotal()) * .2))}
                        </div>
                    </div>

                    <div className={`${s.row} ${s.total}`}>
                        <div className={s.label}>
                            TOTAL
                        </div>
                        <div className={s.value}>
                            {(formatCurrency((getRawPrice() + getSetupOptionsTotal()) * 1.2))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={s.bottom}>
                <div className={s.actions}>
                    <button
                        style={{
                            backgroundColor: 'var(--bgTertiary)'
                        }}
                        onClick={closeModal}
                    >
                        Back
                    </button>
                    <button
                        onClick={() => {
                            clearCart()
                            showModal(<ReceiptModal name={name} value={value} />)
                        }}
                    >
                        <span>
                            Confirm
                        </span>
                    </button>
                </div>
            </div>
        </motion.div >
    )
}

function CheckoutModal() {
    const { closeModal, showModal } = useModal()
    const modalRef = useRef<HTMLDivElement>(null)
    const [companyName, setCompanyName] = useState('')
    const [companyNumber, setCompanyNumber] = useState('')
    const { getRawPrice, getSetupOptionsTotal } = useCart()

    const disableContinue = companyName === '' || companyNumber === ''

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [closeModal])

    return (
        <motion.div
            ref={modalRef}
            className={s.modal}
            transition={{
                duration: 0.5,
                type: 'spring',
                ease: 'easeInOut',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
        >
            <div className={s.heading}>
                <p style={{
                    fontWeight: 'bold',
                    fontSize: '2rem'
                }}>Checkout</p>
                <span
                    style={{
                        color: 'var(--textSecondary)'
                    }}
                >
                    Enter your company details to continue
                </span>
            </div>

            <div className={s.body}>
                <div className={s.costumerDetails}>
                    <div className={s.inputGroup}>
                        <div>
                            <div className={s.label}>
                                Company name
                            </div>
                        </div>
                        <input
                            type="text"
                            value={companyName}
                            placeholder="MASA Telecomunications"
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div className={s.inputGroup}>
                        <div className={s.label}>
                            Company number
                        </div>
                        <input
                            type='text'
                            value={companyNumber}
                            placeholder='070 6476 9189'
                            onChange={(e) => setCompanyNumber(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className={s.bottom}>
                <div className={s.actions}>
                    <button
                        style={{
                            backgroundColor: 'var(--bgTertiary)'
                        }}
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            showModal(<OverviewModal name={companyName} value={(formatCurrency((getRawPrice() + getSetupOptionsTotal()) * 1.2))} />)
                        }}
                        disabled={disableContinue}
                    >
                        <span>
                            Continue
                        </span>
                        <ArrowRight />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

function CartItem({ item, delay, canRemove = true }: { item: ICartItem, delay: number, canRemove: boolean }) {
    const { removeFromCart } = useCart()
    return (
        <motion.div
            layout
            initial={{ scale: .75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: .75, opacity: .5 }}
            transition={{ delay }}
            className={s.cartItem}
            onClick={() => {
                if (canRemove) {
                    removeFromCart(item.id, item.setupOption)
                }
            }}
        >
            <div className={s.overview}>
                <div className={s.image}>
                    <img src={item.img} />
                </div>
                <div className={s.info}>
                    <div className={s.name}>
                        {item.name}
                    </div>
                    <div className={s.description}>
                        {item.description}
                    </div>
                    {item.setupOption && (
                        <div
                            className={s.setupOption}
                            style={{ opacity: '.65' }}
                        >
                            Up to {item.setupOption} apps (+{formatCurrency(item.quantity * (item.setupOption === 5 ? 30 : 50))})
                        </div>
                    )}
                </div>
            </div>
            <div className={s.priceQuantity}>
                <div className={s.price}>
                    {formatCurrency(item.price * item.quantity)}
                </div>
                <div className={s.quantity}>
                    x{item.quantity}
                </div>
            </div>
        </motion.div>
    )
}

export default function CartContainer() {
    useCartSync()
    const { showModal } = useModal()
    const cartContainerRef = useRef<HTMLDivElement>(null)
    const { isOpen, close, cart, clearCart, getRawPrice, getSetupOptionsTotal } = useCart()

    const isCartEmpty = cart.length === 0

    useEffect(() => {
        const handleEscKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscKeyPress)
        }

        return () => {
            document.removeEventListener('keydown', handleEscKeyPress)
        }
    }, [isOpen, close])

    useLockBodyScroll(isOpen)

    if (!isOpen) return null

    return ReactDOM.createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={s.backdrop}
            onClick={close}
        >
            <motion.div
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 125,
                    damping: 15,
                    duration: 0.1
                }}
                ref={cartContainerRef}
                className={s.cartContainer}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={s.heading}>
                    <div>
                        My Cart
                    </div>
                    <div className={s.actions}>
                        <button
                            onClick={clearCart}
                            className={s.clear}
                            disabled={isCartEmpty}
                        >
                            <Trash />
                        </button>
                        <button
                            onClick={close}
                            className={s.close}
                        >
                            <XMark />
                        </button>
                    </div>
                </div>
                <div className={s.cartBody}>
                    {
                        isCartEmpty && (
                            <div className={s.emptyCart}>
                                <Cart />
                                <span>Your cart is empty.</span>
                            </div>
                        )
                    }
                    {
                        !isCartEmpty && (
                            <div className={s.cartContent}>
                                {
                                    cart.map((item, index) => (
                                        <CartItem canRemove={true} item={item} delay={index * .05} key={item.id} />
                                    ))
                                }
                            </div>
                        )
                    }
                    <div className={`${s.cartTotal} ${isCartEmpty ? s.disabled : ''}`}>
                        <div className={s.row}>
                            <div className={s.label}>
                                Subtotal
                            </div>
                            <div className={s.value}>
                                {formatCurrency(getRawPrice())}
                            </div>
                        </div>

                        <div className={s.row}>
                            <div className={s.label}>
                                Set-up options
                            </div>
                            <div className={s.value}>
                                {formatCurrency(getSetupOptionsTotal())}
                            </div>
                        </div>

                        <div className={s.row}>
                            <div className={s.label}>
                                Taxes (+20%)
                            </div>
                            <div className={s.value}>
                                {(formatCurrency((getRawPrice() + getSetupOptionsTotal()) * .2))}
                            </div>
                        </div>

                        <div className={`${s.row} ${s.total}`}>
                            <div className={s.label}>
                                TOTAL
                            </div>
                            <div className={s.value}>
                                {(formatCurrency((getRawPrice() + getSetupOptionsTotal()) * 1.2))}
                            </div>
                        </div>
                        <div className={s.checkout}>
                            <button
                                disabled={isCartEmpty}
                                onClick={() => {
                                    close()
                                    showModal(<CheckoutModal />)
                                }}
                            >
                                <Bag />
                                PROCEED TO CHECKOUT
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    )
}
