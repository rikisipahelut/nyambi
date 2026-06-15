"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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

interface ApiReview {
  id: string;
  order_id: string;
  worker: { id: string; nama: string; specialty: string };
  rating: number;
  comment: string;
  created_at: string;
}

function mapReview(r: ApiReview): Review {
  return {
    reviewId:   r.id,
    orderId:    r.order_id,
    workerId:   r.worker?.id ?? "",
    workerName: r.worker?.nama ?? "",
    specialty:  r.worker?.specialty ?? "",
    rating:     r.rating,
    comment:    r.comment,
    createdAt:  r.created_at,
  };
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: ApiReview[] }>("/reviews/me")
      .then((res) => setReviews(res.data.map(mapReview)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function addReview(data: {
    order_id: string;
    rating: number;
    comment: string;
  }): Promise<void> {
    const res = await api.post<{ data: ApiReview }>("/reviews", data);
    setReviews((prev) => [mapReview(res.data), ...prev]);
  }

  function hasReview(orderId: string) {
    return reviews.some((r) => r.orderId === orderId);
  }

  return { reviews, loading, addReview, hasReview };
}
