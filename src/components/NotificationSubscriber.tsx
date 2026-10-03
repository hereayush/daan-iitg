"use client";
import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationSubscriber() {
  const [status, setStatus] = useState<"default" | "granted" | "denied">("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setStatus(Notification.permission as "default" | "granted" | "denied");
    }
  }, []);

  const subscribe = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Push notifications not supported in this browser.");
      return;
    }
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission as "default" | "granted" | "denied");
      if (permission !== "granted") {
        toast.error("Notification permission denied.");
        setLoading(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      const { endpoint, keys } = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      const res = await fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, p256dh: keys.p256dh, auth: keys.auth }),
      });
      if (res.ok) toast.success("Notifications enabled!");
      else toast.error("Failed to save subscription.");
    } catch (err) {
      toast.error("Could not enable notifications.");
    }
    setLoading(false);
  };

  if (status === "granted") return null;
  if (status === "denied") return null;

  return (
    <button
      onClick={subscribe}
      disabled={loading}
      className="btn-cartoon btn-yellow text-xs px-3 py-1.5 fixed bottom-20 right-4 z-40 shadow-cartoon-lg"
    >
      {loading ? <span className="w-3 h-3 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : <Bell size={14} />}
      Enable Notifications
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
