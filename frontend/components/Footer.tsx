import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-semibold mb-2">Categories</h4>
          <ul className="space-y-1">
            <li><Link href="/products?category=laptops">Laptops</Link></li>
            <li><Link href="/products?category=accessories">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">About</h4>
          <ul className="space-y-1">
            <li><Link href="/about">Company</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1">
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Connect</h4>
          <ul className="space-y-1">
            <li><a href="mailto:support@kwalas.tech">Email</a></li>
            <li><a href="https://twitter.com/">Twitter</a></li>
          </ul>
        </div>
      </div>
      <p className="text-center text-sm mt-6">&copy; {new Date().getFullYear()} Kwalas Tech</p>
    </footer>
  );
}
