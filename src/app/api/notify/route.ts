import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import webpush from "web-push";

// Initialize VAPID inside the handler so it's only called at runtime, not build time
function initVapid() {
  const email = process.env.VAPID_EMAIL;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (email && pub && pub.length > 20 && priv && priv.length > 10) {
    webpush.setVapidDetails(email, pub, priv);
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "sub_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, body, url } = await req.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  // Save notification to history
  await supabase.from("notifications").insert({ title, body, url, sent_at: new Date().toISOString() });

  // Check if VAPID is configured
  if (!initVapid()) {
    return NextResponse.json({ sent: 0, warning: "VAPID keys not configured" });
  }

  // Get all subscriptions
  const { data: subs } = await supabase.from("push_subscriptions").select("*");
  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const payload = JSON.stringify({ title, body, url: url || "/" });
  let sent = 0;
  const toDelete: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err: unknown) {
        if (err && typeof err === "object" && "statusCode" in err &&
          (err.statusCode === 404 || err.statusCode === 410)) {
          toDelete.push(sub.id);
        }
      }
    })
  );

  if (toDelete.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", toDelete);
  }

  return NextResponse.json({ sent });
}
