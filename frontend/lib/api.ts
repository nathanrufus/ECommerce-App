export async function fetchProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`);
  return res.json();
}
