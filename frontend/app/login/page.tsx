"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      login(data.user, data.token)
      toast.success("Login successful")
      router.push("/")
    } catch (err: any) {
      toast.error(err.message || "Login failed")
    }
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4 min-h-screen">
      <h1 className="text-3xl font-bold text-[#1B1D30] mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#1B1D30] hover:bg-[#70B244] text-white px-4 py-2 rounded-md"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Don’t have an account?{" "}
        <a href="/register" className="text-[#1B1D30] underline hover:text-[#70B244]">
          Register here
        </a>
      </p>
    </div>
  )
}
