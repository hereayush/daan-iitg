"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 3 seconds
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-fade-in-up">
      <div className="card-cartoon bg-white p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-navy/50 hover:text-navy"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-coral border-2 border-navy rounded-lg flex items-center justify-center flex-shrink-0">
            <Download size={18} className="text-white" />
          </div>
          <div>
            <p className="font-fredoka font-600 text-navy text-base leading-tight">
              Install DAAN IITG
            </p>
            <p className="font-nunito text-sm text-navy/70 mt-0.5 leading-snug">
              Add to your home screen for quick access — works offline too!
            </p>
            <button
              onClick={handleInstall}
              className="btn-cartoon btn-coral text-sm mt-3 w-full"
            >
              <Download size={14} />
              Install App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
