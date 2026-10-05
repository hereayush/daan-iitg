"use client";

import { useEffect, useState } from "react";
import { Download, MonitorDown, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installRequested, setInstallRequested] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setInstalled(isInstalled());
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
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

        {deferredPrompt ? (
          <button onClick={handleInstall} disabled={installRequested} className="btn-cartoon btn-coral mt-6 w-full disabled:opacity-60">
            <Download size={17} /> {installRequested ? "Finishing installation…" : "Install App"}
          </button>
        ) : isIOS ? (
          <p className="mt-6 rounded-lg border-2 border-navy bg-cream p-3 font-nunito text-sm text-navy">In Safari, tap <strong>Share</strong>, choose <strong>Add to Home Screen</strong>, then open DAAN IITG from your home screen.</p>
        ) : (
          <p className="mt-6 rounded-lg border-2 border-navy bg-cream p-3 font-nunito text-sm text-navy">Use Chrome or Edge&apos;s install option from the address bar or browser menu, then reopen DAAN IITG as an app.</p>
        )}
      </div>
    </div>
  );
}
