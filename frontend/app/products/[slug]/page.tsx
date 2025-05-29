"use client"

import {
	useEffect,
	useState,
} from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

type Product = {
	id: string
	name: string
	description: string
	price: number
	image: string
	stock_quantity: number
}

type Review = {
	id: string
	name: string
	comment: string
	rating: number
}

type Related = {
	id: string
	name: string
	slug: string
	image: string
	price: number
}

export default function ProductDetailsPage() {
	const { slug } = useParams()
	const [product, setProduct] =
		useState<Product | null>(null)
	const [quantity, setQuantity] =
		useState(1)
	const [reviews, setReviews] = useState<
		Review[]
	>([])
	const [related, setRelated] = useState<
		Related[]
	>([])

	const baseURL =
		process.env.NEXT_PUBLIC_API_BASE_URL

	useEffect(() => {
		if (!slug) return

		const fetchData = async () => {
			const res = await fetch(
				`${baseURL}/products/${slug}`
			)
			const data = await res.json()
			setProduct(data.product)
			setReviews(data.reviews || [])
			setRelated(data.related || [])
		}

		fetchData()
	}, [slug])

	if (!product)
		return (
			<div className="text-center py-20">
				Loading product...
			</div>
		)

	return (
		<div className="max-w-5xl mx-auto px-4 py-12 mt-20">
			<Link
				href="/products"
				className="inline-block mb-6 px-4 py-2 bg-[#1B1D30] text-white text-sm rounded hover:bg-[#70B244] transition"
			>
				← Back to Products
			</Link>

			<h1 className="text-3xl font-bold text-[#1B1D30] mb-2">
				Product Details
			</h1>
			<p className="text-gray-600 mb-8">
				Discover more about this amazing
				product.
			</p>

			{/* Product Grid */}
			<div className="grid md:grid-cols-2 gap-8 mb-12">
				{/* Image */}
				<div>
					<div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
						<Image
							src={
								product.image || "/image.webp"
							}
							alt={product.name}
							fill
							className="object-contain"
						/>
					</div>
				</div>

				{/* Info */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-[#1B1D30]">
						{product.name}
					</h2>
					<p className="text-sm text-gray-600">
						{product.description}
					</p>
					<p className="text-lg font-bold text-[#1B1D30]">
						${product.price}
					</p>

					{/* Stock */}
					<p
						className={`text-sm font-medium ${
							product.stock_quantity > 0
								? "text-green-600"
								: "text-red-500"
						}`}
					>
						{product.stock_quantity > 0
							? "In Stock"
							: "Out of Stock"}
					</p>

					{/* Quantity Selector */}
					<div className="flex items-center gap-2">
						<label
							htmlFor="qty"
							className="text-sm font-medium"
						>
							Select Quantity
						</label>
						<input
							type="number"
							id="qty"
							min={1}
							value={quantity}
							onChange={(e) =>
								setQuantity(
									Number(e.target.value)
								)
							}
							className="w-20 border border-gray-300 px-2 py-1 rounded-md text-sm"
						/>
					</div>

					{/* Add to Cart */}
					<button
						disabled={
							product.stock_quantity < 1
						}
						className="mt-4 px-6 py-2 rounded-md bg-[#1B1D30] hover:bg-[#70B244] text-white transition disabled:opacity-50"
					>
						Add to Cart
					</button>
				</div>
			</div>

			{/* Reviews */}
			<div className="mb-12">
				<h3 className="text-2xl font-bold mb-6 text-[#1B1D30]">
					Customer Reviews
				</h3>
				{reviews.length === 0 ? (
					<p className="text-gray-500">
						No reviews yet.
					</p>
				) : (
					reviews.map((rev) => (
						<div
							key={rev.id}
							className="border-b border-gray-200 pb-4 mb-4"
						>
							<p className="text-sm font-semibold text-[#1B1D30]">
								{rev.name}
							</p>
							<p className="text-sm text-gray-600">
								{rev.comment}
							</p>
							<p className="text-yellow-500 text-sm">
								{"★".repeat(rev.rating)}
							</p>
						</div>
					))
				)}
			</div>

			{/* Related Products */}
			<div className="mb-12">
				<h3 className="text-2xl font-bold mb-6 text-[#1B1D30]">
					Related Products
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{related.map((rel) => (
						<Link
							href={`/products/${rel.slug}`}
							key={rel.id}
							className="relative bg-white rounded-xl shadow-sm hover:shadow-lg p-3 transition flex flex-col"
						>
							<Image
								src={rel.image || "/image.webp"}
								alt={rel.name}
								width={300}
								height={200}
								className="rounded-md object-cover mb-3"
							/>
							<h4 className="text-sm font-medium text-[#1B1D30] mb-1">
								{rel.name}
							</h4>
							<p className="text-xs text-gray-500">
								${rel.price}
							</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}
