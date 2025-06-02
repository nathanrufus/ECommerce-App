"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-hot-toast"

export default function AccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please login to access your account")
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null 

  return (
    <div className="max-w-xl mx-auto px-4 py-20 mt-20">
      <h1 className="text-3xl font-bold text-[#1B1D30] mb-6">Your Account</h1>

      <div className="border rounded-lg p-6 bg-white shadow-md space-y-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-[#1B1D30]">Name:</span> {user.name}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-[#1B1D30]">Email:</span> {user.email}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-[#1B1D30]">Role:</span> {user.role}
        </p>

        <button
          onClick={() => {
            logout()
            toast.success("Logged out successfully")
            router.push("/login")
          }}
          className="mt-4 bg-[#1B1D30] hover:bg-[#70B244] text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
