"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useOrders, type Order } from "@/hooks/useOrders";
import { useReviews, type Review } from "@/hooks/useReviews";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-xs">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110"
          aria-label={`${s} bintang`}
        >
          <span
            className="material-symbols-outlined text-[28px] text-cta-amber transition-all"
            style={{ fontVariationSettings: (hover || value) >= s ? "'FILL' 1" : "'FILL' 0" }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ order, onSubmit }: { order: Order; onSubmit: (r: Review) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Pilih bintang terlebih dahulu."); return; }
    if (comment.trim().length < 10) { setError("Ulasan minimal 10 karakter."); return; }
    onSubmit({
      reviewId: `rev_${Date.now()}`,
      orderId: order.orderId,
      workerId: order.workerId,
      workerName: order.worker,
      specialty: order.specialty,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-lg space-y-md border-t border-cream-dark pt-lg">
      <div>
        <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Rating</p>
        <StarPicker value={rating} onChange={(v) => { setRating(v); setError(""); }} />
      </div>
      <div>
        <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Ulasan</p>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => { setComment(e.target.value); setError(""); }}
          placeholder="Bagikan pengalaman Anda dengan pekerja ini..."
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md resize-none focus:outline-none focus:border-primary transition-all"
        />
      </div>
      {error && (
        <p className="text-error text-body-md font-body-md flex items-center gap-xs">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </p>
      )}
      <button
        type="submit"
        className="px-3xl py-sm rounded-full bg-primary text-on-primary font-bold text-body-md hover:bg-primary-container transition-all active:scale-95"
      >
        Kirim Ulasan
      </button>
    </form>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function UlasanClient() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const { orders } = useOrders();
  const { reviews, addReview, hasReview } = useReviews();
  const [openForm, setOpenForm] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/masuk");
  }, [ready, user, router]);

  if (!ready || !user) return null;

  const completedOrders = orders.filter((o) => o.status === "selesai");

  return (
    <div className="space-y-3xl">
      {/* Existing reviews */}
      {reviews.length > 0 && (
        <section>
          <h2 className="font-headline-md text-headline-md text-forest-deep mb-xl">
            Ulasan Diberikan
            <span className="ml-sm text-primary">({reviews.length})</span>
          </h2>
          <div className="space-y-lg">
            {reviews.map((r) => (
              <div key={r.reviewId} className="bg-surface-container-low border border-cream-dark rounded-2xl p-xl">
                <div className="flex items-start justify-between gap-lg mb-md">
                  <div>
                    <p className="font-body-lg text-body-lg text-forest-deep font-bold">{r.workerName}</p>
                    <p className="text-on-surface-variant text-body-md">{r.specialty}</p>
                  </div>
                  <div className="flex items-center gap-xs shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-[18px] text-cta-amber"
                        style={{ fontVariationSettings: r.rating >= s ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-on-surface font-body-md text-body-md leading-relaxed mb-md">&ldquo;{r.comment}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <p className="text-on-surface-variant text-label-sm font-label-sm">{formatDate(r.createdAt)}</p>
                  <Link href={`/pekerja/${r.workerId}`} className="text-primary text-label-sm font-label-sm hover:underline">
                    Lihat profil pekerja →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed orders pending review */}
      {completedOrders.filter((o) => !hasReview(o.orderId)).length > 0 && (
        <section>
          <h2 className="font-headline-md text-headline-md text-forest-deep mb-xl">Menunggu Ulasan</h2>
          <div className="space-y-lg">
            {completedOrders.filter((o) => !hasReview(o.orderId)).map((order) => (
              <div key={order.orderId} className="bg-surface-container-low border border-cream-dark rounded-2xl p-xl">
                <div className="flex items-start gap-lg">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-lg text-body-lg text-forest-deep font-bold">{order.worker}</p>
                    <p className="text-on-surface-variant text-body-md">{order.specialty}</p>
                    <p className="text-on-surface-variant text-label-sm font-label-sm mt-xs">
                      Selesai {formatDate(order.tanggal)}
                    </p>
                    {openForm === order.orderId ? (
                      <ReviewForm
                        order={order}
                        onSubmit={(r) => { addReview(r); setOpenForm(null); }}
                      />
                    ) : (
                      <button
                        onClick={() => setOpenForm(order.orderId)}
                        className="mt-md inline-flex items-center gap-xs px-xl py-sm rounded-full bg-primary text-on-primary font-bold text-body-md hover:bg-primary-container transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">rate_review</span>
                        Tulis Ulasan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {reviews.length === 0 && completedOrders.length === 0 && (
        <div className="text-center py-5xl">
          <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-2xl">
            <span className="material-symbols-outlined text-outline text-[48px]">rate_review</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">Belum ada ulasan</h2>
          <p className="text-text-mid font-body-md max-w-128 mx-auto mb-3xl">
            Ulasan akan muncul setelah Anda menyelesaikan pesanan dan menilai pekerja.
          </p>
          <Link
            href="/pekerja"
            className="inline-block px-4xl py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all"
          >
            Cari Pekerja
          </Link>
        </div>
      )}
    </div>
  );
}
