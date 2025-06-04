"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"

type ReviewFormProps = {
  productId: string
  onSuccess: () => void
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("You must be logged in to leave a review")
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment,
          rating,
          product_id: productId,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to submit review")
      }

      toast.success("Review submitted!")
      setComment("")
      setRating(5)
      onSuccess()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Could not submit review")
    }
  }

  return (
    <div className="mt-10 border-t border-gray-300 pt-6">
      <h4 className="text-xl font-bold text-[#1B1D30] mb-4">Leave a Review</h4>
      <div className="grid gap-4">
        <textarea
          placeholder="Your Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#70B244]"
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#70B244]"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="bg-[#1B1D30] hover:bg-[#70B244] transition-colors text-white px-4 py-2 rounded-md font-medium text-sm"
        >
          Submit Review
        </button>
      </div>
    </div>
  )
}
