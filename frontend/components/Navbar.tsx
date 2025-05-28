"use client"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
	const [open, setOpen] = useState(false)

	return (
		<nav className="bg-primary text-light px-6 py-4 shadow-md">
			<div className="flex justify-between items-center max-w-7xl mx-auto">
				<Link
					href="/"
					className="flex items-center space-x-2"
				>
					<Image
						src="/kwala.png"
						alt="Kwalas Logo"
						width={32}
						height={32}
						className="rounded-full"
					/>
					<span className="text-xl font-bold text-light">
						Kwalas Tech
					</span>
				</Link>

				<div className="hidden md:flex space-x-6">
					<Link href="/products">Shop</Link>
					<Link href="/explore">
						Explore
					</Link>
					<Link href="/cart">Cart</Link>
					<Link href="/login">Login</Link>
				</div>

				<button
					className="md:hidden"
					onClick={() => setOpen(!open)}
				>
					{open ? <X /> : <Menu />}
				</button>
			</div>

			{open && (
				<div className="flex flex-col mt-4 space-y-2 md:hidden">
					<Link href="/products">Shop</Link>
					<Link href="/explore">
						Explore
					</Link>
					<Link href="/cart">Cart</Link>
					<Link href="/login">Login</Link>
				</div>
			)}
		</nav>
	)
}
