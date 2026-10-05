"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, MonitorDown, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

function subscribeToInstallState(onStoreChange: () => void) {
  window.addEventListener("appinstalled", onStoreChange);
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => {
    window.removeEventListener("appinstalled", onStoreChange);
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getInstallState() {
  return isInstalled();
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installRequested, setInstallRequested] = useState(false);
  const installed = useSyncExternalStore(subscribeToInstallState, getInstallState, () => false);
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstallRequested(true);
    else setDeferredPrompt(null);
  };

  if (installed) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-navy/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="install-title">
      <div className="card-cartoon w-full max-w-md bg-white p-7 text-center animate-fade-in-up">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border-2 border-navy bg-coral shadow-cartoon">
          {isIOS ? <Smartphone size={30} className="text-white" /> : <MonitorDown size={30} className="text-white" />}
        </div>
        <h1 id="install-title" className="font-fredoka text-2xl font-700 text-navy">Install DAAN IITG to continue</h1>
        <p className="mt-3 font-nunito text-sm leading-relaxed text-navy/70">This community portal is available as an app. Install it for the full experience, then open it from your home screen or app launcher.</p>

        <button onClick={handleInstall} disabled={!deferredPrompt || installRequested} className="btn-cartoon btn-coral mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60">
          <Download size={17} /> {installRequested ? "Finishing installation…" : "Install App"}
        </button>
        {!deferredPrompt && (isIOS ? (
          <p className="mt-4 rounded-lg border-2 border-navy bg-cream p-3 font-nunito text-sm text-navy">In Safari, tap <strong>Share</strong>, choose <strong>Add to Home Screen</strong>, then open DAAN IITG from your home screen.</p>
        ) : (
          <p className="mt-4 rounded-lg border-2 border-navy bg-cream p-3 font-nunito text-sm text-navy">The install option is loading. If it does not activate, use Chrome or Edge&apos;s install option from the address bar or browser menu.</p>
        ))}
      </div>
    </div>
  );
}
