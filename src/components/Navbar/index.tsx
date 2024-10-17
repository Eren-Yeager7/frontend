'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { config } from '@/config'

import s from './s.module.css'
import Cart from '@/components/CartButton'
import StoreIcon from '@/icons/bag-shopping'

const links = [
    {
        name: 'About',
        url: '/'
    },
    {
        name: 'Products',
        url: '/products'
    },
    {
        name: 'Documentation',
        url: '/docs'
    }
]

export default function Navbar() {
    const pathname = usePathname()
    return (
        <nav className={s.nav}>
            <div className={s.container}>
                <Link href='/' className={s.logo}>
                    <StoreIcon />
                    <span>{config.shopName}</span>
                </Link>
            </div>
            <div className={s.container}>
                <div className={s.links}>
                    {
                        links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`${s.link} ${pathname === link.url ? s.active : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))
                    }
                </div>
                <Cart />
            </div>
        </nav>
    )
}