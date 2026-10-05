"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationSubscriber() {
  const [status, setStatus] = useState<"default" | "granted" | "denied">("default");
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        setSupported(false);
        return;
      }
      setStatus(Notification.permission as "default" | "granted" | "denied");
      if (Notification.permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          // Re-save an existing browser subscription. This recovers users who
          // granted permission before the server was able to store it.
          const result = await saveSubscription(subscription);
          setSubscribed(result.ok);
        }
      }
    };
    void checkSubscription().catch(() => setSupported(false));
  }, []);

  const subscribe = async () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey || publicKey.length < 20) {
      toast.error("Notifications are not configured yet. Please contact the site administrator.");
      return;
    }
    if (!supported) {
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
      const sub = await reg.pushManager.getSubscription() ?? await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const result = await saveSubscription(sub);
      if (result.ok) {
        setSubscribed(true);
        toast.success("Notifications enabled!");
      } else {
        toast.error(result.error || "Failed to save subscription. Please try again.");
      }
    } catch {
      toast.error("Could not enable notifications.");
    }
    setLoading(false);
  };

  if (!supported || subscribed) return null;
  if (status === "denied") return null;

  return (
    <button
      onClick={subscribe}
      disabled={loading}
      className="btn-cartoon btn-yellow text-xs px-3 py-1.5 fixed bottom-20 right-4 z-40 shadow-cartoon-lg"
    >
      {loading ? <span className="w-3 h-3 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : <Bell size={14} />}
      {status === "granted" ? "Finish Enabling Notifications" : "Enable Notifications"}
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

async function saveSubscription(subscription: PushSubscription) {
  const { endpoint, keys } = subscription.toJSON();
  if (!endpoint || !keys?.p256dh || !keys.auth) {
    return { ok: false, error: "The browser returned an incomplete notification subscription." };
  }
  const response = await fetch("/api/push-subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint, p256dh: keys.p256dh, auth: keys.auth }),
  });
  if (response.ok) return { ok: true };
  const data = await response.json().catch(() => ({}));
  return { ok: false, error: data.error as string | undefined };
}
