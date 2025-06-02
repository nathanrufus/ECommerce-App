"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"

type ReviewFormProps = {
  productId: string
  onSuccess: () => void
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [name, setName] = useState("")
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
          name,
          comment,
          rating,
          product_id: Number(productId),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to submit review")
      }

      toast.success("Review submitted!")
      setName("")
      setComment("")
      setRating(5)
      onSuccess()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Could not submit review")
    }
  }

  return (
    <div className="mt-6 border-t pt-6">
      <h4 className="text-xl font-semibold mb-4 text-[#1B1D30]">Leave a Review</h4>
      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />
        <textarea
          placeholder="Your Comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />
        <select
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          className="border px-3 py-2 rounded-md text-sm"
        >
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="bg-[#1B1D30] hover:bg-[#70B244] text-white px-4 py-2 rounded-md"
        >
          Submit Review
        </button>
      </div>
    </div>
  )
}
