"use client";

import { useEffect, useState } from "react";

export interface Review {
  reviewId: string;
  orderId: string;
  workerId: string;
  workerName: string;
  specialty: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const KEY = "nyambi_reviews";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setReviews(JSON.parse(raw));
    } catch {}
  }, []);

  function addReview(review: Review) {
    setReviews((prev) => {
      const updated = [review, ...prev];
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function hasReview(orderId: string) {
    return reviews.some((r) => r.orderId === orderId);
  }

  return { reviews, addReview, hasReview };
}
