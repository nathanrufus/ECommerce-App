"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
	id: string | number;
	name: string;
	price: number;
	slug: string;
	image: string;
	isBestSeller?: boolean;
};

type Brand = {
	id: string;
	name: string;
	slug: string;
};

type Category = {
	id: string;
	name: string;
	slug: string;
	parent_id?: string | null;
};

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({
		minPrice: "",
		maxPrice: "",
		brand: "",
		category: "",
	});

	useEffect(() => {
		const fetchFilters = async () => {
			try {
				const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
				const [brandsRes, categoriesRes] = await Promise.all([
					fetch(`${baseURL}/brands`),
					fetch(`${baseURL}/categories`),
				]);
				const brandsData = await brandsRes.json();
				const categoriesData = await categoriesRes.json();
				setBrands(brandsData);
				setCategories(categoriesData);
			} catch (err) {
				console.error("Failed to load filter options:", err);
			}
		};
		fetchFilters();
	}, []);

	const fetchProducts = async () => {
		const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
		const query = new URLSearchParams();

		if (filters.minPrice) query.append("minPrice", filters.minPrice);
		if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
		if (filters.brand) query.append("brand", filters.brand);
		if (filters.category) query.append("category", filters.category);

		console.log("Filters applied:", filters);
		console.log("Final query:", query.toString());

		try {
			setLoading(true);
			const res = await fetch(`${baseURL}/filter/products?${query.toString()}`);
			const data = await res.json();
			console.log("API returned:", data);
			setProducts(data);
		} catch (err) {
			console.error("Failed to fetch products:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleApplyFilters = () => fetchProducts();

	const handleReset = () => {
		setFilters({ minPrice: "", maxPrice: "", brand: "", category: "" });
		fetchProducts();
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-12 pt-20">
			{/* FILTERS */}
			<div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mb-10">
				<h3 className="text-xl font-semibold text-[#1B1D30] mb-6 text-center">🎯 Filter Products</h3>

				{/* Price Range */}
				<div className="mb-6">
					<h4 className="text-sm font-medium text-[#1B1D30] mb-2">Price Range</h4>
					<div className="flex gap-3">
						<input
							type="number"
							placeholder="Min"
							className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
							value={filters.minPrice}
							onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
						/>
						<input
							type="number"
							placeholder="Max"
							className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
							value={filters.maxPrice}
							onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
						/>
					</div>
				</div>

				{/* Brands */}
				<div className="mb-6">
					<h4 className="text-sm font-medium text-[#1B1D30] mb-2">Brands</h4>
					<div className="flex flex-wrap gap-2">
						{brands.map((brand) => (
							<button
								key={brand.id}
								onClick={() =>
									setFilters({
										...filters,
										brand: filters.brand === brand.id ? "" : brand.id,
									})
								}
								className={`px-4 py-1.5 text-xs rounded-md border ${
									filters.brand === brand.id
										? "bg-[#70B244] text-white"
										: "bg-white text-gray-600 border-gray-300 hover:bg-[#70B244] hover:text-white"
								} transition`}
							>
								{brand.name}
							</button>
						))}
					</div>
				</div>

				{/* Categories */}
				<div className="mb-6">
					<h4 className="text-sm font-medium text-[#1B1D30] mb-2">Categories</h4>
					<div className="flex flex-wrap gap-2">
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() =>
									setFilters({
										...filters,
										category: filters.category === cat.id ? "" : cat.id,
									})
								}
								className={`px-4 py-1.5 text-xs rounded-md border ${
									filters.category === cat.id
										? "bg-[#70B244] text-white"
										: "bg-white text-gray-600 border-gray-300 hover:bg-[#70B244] hover:text-white"
								} transition`}
							>
								{cat.name}
							</button>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4 mt-6">
					<button
						onClick={handleApplyFilters}
						className="bg-[#1B1D30] text-white px-5 py-2 rounded-md text-sm hover:bg-[#70B244] transition w-full"
					>
						Apply Filters
					</button>
					<button
						onClick={handleReset}
						className="text-sm text-[#1B1D30] font-medium underline underline-offset-4 hover:text-[#70B244] transition"
					>
						Reset
					</button>
				</div>
			</div>

			{/* PRODUCT GRID */}
			<section>
				<h2 className="text-2xl font-semibold text-[#1B1D30] mb-6">Available Products</h2>
				{loading ? (
					<div className="text-center py-10 text-gray-600">Loading products...</div>
				) : products.length === 0 ? (
					<div className="text-center text-sm text-gray-500">No products found. Try adjusting your filters.</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{products.map((product) => (
							<div
								key={product.id}
								className="relative bg-white rounded-xl shadow-sm hover:shadow-lg p-3 transition flex flex-col"
							>
								{product.isBestSeller && (
									<span className="absolute top-2 left-2 bg-[#70B244] text-white text-xs px-2 py-0.5 rounded">
										Best Seller
									</span>
								)}
								<Image
									src={product.image || "/image.webp"}
									alt={product.name}
									width={300}
									height={200}
									className="rounded-md object-cover mb-3"
								/>
								<h4 className="text-sm font-medium text-[#1B1D30] mb-1">{product.name}</h4>
								<p className="text-xs text-gray-500 mb-2">${product.price}</p>
								<Link
									href={`/products/${product.slug}`}
									className="text-xs text-[#70B244] hover:underline"
								>
									View
								</Link>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
