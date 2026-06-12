"use client";

import { useEffect, useState } from "react";

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

const KEY = "nyambi_orders";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {}
  }, []);

  function saveOrder(order: Order) {
    setOrders((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function updateStatus(orderId: string, status: OrderStatus) {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.orderId === orderId ? { ...o, status } : o));
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }

  return { orders, saveOrder, updateStatus };
}

export function addOrder(order: Order) {
  try {
    const raw = localStorage.getItem(KEY);
    const existing: Order[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(KEY, JSON.stringify([order, ...existing]));
  } catch {}
}
