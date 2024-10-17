'use client'


import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/util'
import type { ChangeEvent } from 'react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/useToast'


import s from './s.module.css'
import Plus from '@/icons/plus'
import Minus from '@/icons/minus'
import Cart from '@/icons/cart-shopping'
import Ripple from '@/components/Ripple'
import Selector from '@/components/Selector'
import SetupOptionsIcon from '@/icons/screwdriver-wrench'

// would have handled this in the backend
const options = [
    {
        type: 5,
        label: 'Max. 5'
    },
    {
        type: 10,
        label: 'Max. 10'
    }
]

const phones = [
    {
        id: 1,
        name: 'iPhone 8 Plus',
        description: 'Basic',
        img: 'https://m.media-amazon.com/images/I/51MSyMmAc-L.__AC_SY300_SX300_QL70_FMwebp_.jpg',
        price: 250
    },
    {
        id: 2,
        name: 'Google Pixel 6',
        description: 'Basic',
        img: 'https://m.media-amazon.com/images/I/61ruKkvVIxL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: 250
    },
    {
        id: 3,
        name: 'iPhone 11',
        description: 'Standard',
        img: 'https://m.media-amazon.com/images/I/715HCLsOHbL.__AC_SY445_SX342_QL70_ML2_.jpg',
        price: 450
    },
    {
        id: 4,
        name: 'iPhone 11 Pro',
        description: 'Standard',
        img: 'https://m.media-amazon.com/images/I/61NfnaEUqOL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: 450
    },
    {
        id: 5,
        name: 'iPhone 16',
        description: 'Superior',
        img: 'https://m.media-amazon.com/images/I/41CEGtQGb7L._AC_SX679_.jpg',
        price: 950
    },
    {
        id: 6,
        name: 'iPhone 16 Pro Max',
        description: 'Superior',
        img: 'https://m.media-amazon.com/images/I/51h5Uuew0CL._AC_SX679_.jpg',
        price: 950
    }
]

interface Phone {
    id: number
    img: string
    name: string
    price: number
    description: string
}

function Product({ product }: { product: Phone }) {
    const { showToast } = useToast()
    const { addToCart } = useCart()
    const [selectedSetupOption, setSelectedSetupOption] = useState(options[0])
    const [quantity, setQuantity] = useState<number>(1)
    const [canAddToCart, setCanAddToCart] = useState(true)

    function handleAddToCart(phone: Phone) {
        setCanAddToCart(false)
        addToCart({ ...phone, quantity, setupOption: selectedSetupOption.type })
        setQuantity(1)
        setTimeout(() => {
            setCanAddToCart(true)
        }, 1000)
    }

    function increment() {
        setQuantity(quantity => Math.min(quantity + 1, 100))
    }

    function decrement() {
        setQuantity(quantity => Math.max(quantity - 1, 1))
    }

    function handleQuantityChange(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target
        let newValue: number | string = Number(value)

        if (newValue < 1) {
            newValue = 1
        } else if (newValue > 100) {
            newValue = 100
        }

        setQuantity(newValue)
    }

    return (
        <div className={s.product}>
            <div className={s.image}>
                <img src={product.img} alt={product.name} />
            </div>
            <div className={s.info}>
                <h2 className={s.name}>{product.name}</h2>
                <span>{product.description}</span>
            </div>
            <div className={s.priceQuantity}>
                <div className={s.price}>
                    <span className={s.value}>{formatCurrency(product.price * quantity)}</span>
                </div>
                <div className={s.quantity}>
                    <button
                        onClick={decrement}
                        disabled={quantity <= 1}
                    >
                        <Minus />
                    </button>
                    <input
                        type='text'
                        value={quantity}
                        onChange={handleQuantityChange}
                    />
                    <button
                        onClick={increment}
                        disabled={quantity >= 100}
                    >
                        <Plus />
                    </button>
                </div>
            </div>

            <div className={s.setupOptions}>
                <div className={s.label}>
                    <SetupOptionsIcon />
                    Apps
                </div>
                <div className={s.selector}>
                    <Selector selected={selectedSetupOption} options={options} setSelected={setSelectedSetupOption} />
                </div>
            </div>

            <button
                onClick={() => {
                    handleAddToCart(product)
                    showToast({
                        type: 'success',
                        content: 'Item added to your cart.'
                    })
                }}
                className={s.addToCart}
                disabled={!canAddToCart}
            >
                <Ripple />
                <Cart />
                <span>ADD TO CART</span>
            </button>
        </div>
    )
}

export default function Page() {
    return (
        <main className={s.main}>
            <div className={s.products}>
                {phones.map((phone, index) => (
                    <motion.div
                        key={phone.id}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.015 }}
                    >
                        <Product product={phone} />
                    </motion.div>
                ))}
            </div>
        </main>
    )
}