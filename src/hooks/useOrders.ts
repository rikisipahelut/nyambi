"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export type OrderStatus = "menunggu" | "dikonfirmasi" | "selesai" | "dibatalkan";

export interface Order {
  orderId: string;
  worker: string;
  specialty: string;
  workerId: string;
  tanggal: string;
  waktu: string;
  deskripsi: string;
  alamat: string;
  telepon: string;
  status: OrderStatus;
  createdAt: string;
}

interface ApiOrder {
  id: string;
  worker: { id: string; nama: string; specialty?: string; image_url?: string };
  tanggal: string;
  waktu: string;
  deskripsi: string;
  alamat: string;
  telepon: string;
  status: OrderStatus;
  created_at: string;
}

function mapOrder(o: ApiOrder): Order {
  return {
    orderId:   o.id,
    worker:    o.worker?.nama ?? "",
    specialty: o.worker?.specialty ?? "",
    workerId:  o.worker?.id ?? "",
    tanggal:   o.tanggal,
    waktu:     o.waktu,
    deskripsi: o.deskripsi,
    alamat:    o.alamat,
    telepon:   o.telepon,
    status:    o.status,
    createdAt: o.created_at,
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: ApiOrder[] }>("/orders?as=customer")
      .then((res) => setOrders(res.data.map(mapOrder)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function cancelOrder(orderId: string) {
    await api.put(`/orders/${orderId}/cancel`);
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: "dibatalkan" } : o))
    );
  }

  async function completeOrder(orderId: string) {
    await api.put(`/orders/${orderId}/complete`);
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: "selesai" } : o))
    );
  }

  return { orders, loading, cancelOrder, completeOrder };
}

// Standalone — dipanggil dari BookingModal
export async function addOrder(payload: {
  worker_id: string;
  tanggal: string;
  waktu: string;
  deskripsi: string;
  alamat: string;
  telepon: string;
}): Promise<Order> {
  const res = await api.post<{ data: ApiOrder }>("/orders", payload);
  return mapOrder(res.data);
}
