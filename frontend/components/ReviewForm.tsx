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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, comment, rating }),
        }
      )
      if (!res.ok) throw new Error("Failed to submit review")
      toast.success("Review submitted!")
      onSuccess()
      setName("")
      setComment("")
      setRating(5)
    } catch (err) {
      console.error(err)
      toast.error("Could not submit review")
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
