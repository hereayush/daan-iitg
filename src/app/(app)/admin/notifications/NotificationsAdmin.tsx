"use client";
import { useState } from "react";
import { Bell, Send, Loader, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationsAdmin() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ sent: number } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) { toast.error("Title required."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url: url || "/" }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); } else {
        setResult(data);
        toast.success(`Notification sent to ${data.sent} users!`);
        setTitle(""); setBody(""); setUrl("");
      }
    } catch { toast.error("Failed to send."); }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h2 className="font-fredoka font-700 text-navy text-2xl mb-2 flex items-center gap-2">
          <Bell size={24} className="text-coral" /> Send Notification
        </h2>
        <p className="font-nunito text-navy/60 text-sm">
          Send a push notification to all users who have enabled notifications. Notifications are also triggered automatically when content is posted.
        </p>
      </div>

      <div className="card-cartoon bg-white p-6">
        <form onSubmit={handleSend} className="flex flex-col gap-5">
          <div>
            <label className="font-nunito font-600 text-sm text-navy mb-1.5 block">Notification Title *</label>
            <input required className="input-cartoon" value={title}
              onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New Achievement Posted!" />
          </div>
          <div>
            <label className="font-nunito font-600 text-sm text-navy mb-1.5 block">Message Body</label>
            <textarea className="input-cartoon" rows={3} value={body}
              onChange={(e) => setBody(e.target.value)} placeholder="Optional message body..." />
          </div>
          <div>
            <label className="font-nunito font-600 text-sm text-navy mb-1.5 block">Link URL</label>
            <input className="input-cartoon" value={url}
              onChange={(e) => setUrl(e.target.value)} placeholder="/achievements or /events" />
          </div>
          <button type="submit" disabled={loading} className="btn-cartoon btn-coral w-full disabled:opacity-60">
            {loading ? (
              <span className="flex items-center gap-2"><Loader size={16} className="animate-spin" /> Sending...</span>
            ) : (
              <span className="flex items-center gap-2"><Send size={16} /> Send to All Users</span>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="card-cartoon bg-white p-5 mt-4 flex items-center gap-3">
          <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
          <div>
            <p className="font-fredoka font-600 text-navy text-base">Notification delivered</p>
            <p className="font-nunito text-sm text-navy/60">Sent to {result.sent} active subscribers.</p>
          </div>
        </div>
      )}
    </div>
  );
}
