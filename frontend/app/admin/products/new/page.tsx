import ProductForm from "@/components/admin/ProductForm"

export default function AddProductPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 mt-20">
      <h1 className="text-2xl font-bold mb-6 text-[#1B1D30]">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
