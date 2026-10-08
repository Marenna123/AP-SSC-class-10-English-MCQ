import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-200 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                  Install on Android Phone
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Android App
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                AP SSC Class 10 English MCQ Learning App
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instant Native Install Button if browser supports it */}
        {deferredPrompt && !isInstalled && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Direct 1-Tap Installation Ready!</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your browser supports direct installation. Tap below to install this app straight onto your Android home screen and app drawer.
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install App on Phone Now</span>
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>This app is already installed on your device in standalone mode!</span>
          </div>
        )}

        {/* Method 1: Instant Chrome / Android Install (WebAPK) */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              Method 1 • Instant WebAPK (Recommended)
            </span>
            <span className="text-[11px] font-bold text-slate-500">100% Free & Fast</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Android automatically builds and installs a real native <strong>WebAPK</strong> onto your phone without requiring untrusted APK security warnings:
          </p>

          <ol className="space-y-2.5 text-xs text-slate-700 font-sans">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>
                Open this app link in <strong>Google Chrome</strong> on your Android phone.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>
                Tap the <strong>Chrome menu icon (⋮)</strong> in the top-right corner.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>
                Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </span>
              <span>
                The app icon will appear on your phone's home screen and app launcher. It works completely offline and runs full-screen!
              </span>
            </li>
          </ol>

          {/* Copy URL bar */}
          <div className="pt-1">
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 text-xs">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-transparent text-slate-600 font-mono text-[11px] truncate focus:outline-hidden"
              />
              <button
                onClick={handleCopyUrl}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Method 2: Generate Signed APK via PWABuilder */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-md border border-slate-300">
              Method 2 • Download Standalone .APK File
            </span>
            <span className="text-[11px] font-bold text-slate-500">Free Tool</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Follow these exact 3 steps on <strong>PWABuilder</strong> to download your <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-700 font-bold">.apk</code> package:
          </p>

          <ol className="space-y-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>
                Click <strong>"Open PWABuilder"</strong> below (your app URL will be loaded automatically).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>
                Click the large purple button labeled <strong>"Package for Stores"</strong> (or <strong>"Package"</strong>) in the top-right corner.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>
                Under the <strong>Google Play / Android</strong> card, click <strong>"Generate Package"</strong> &rarr; <strong>"Download"</strong> to get your standalone <code className="font-bold text-emerald-700">.apk</code>!
              </span>
            </li>
          </ol>

          <a
            href={`https://www.pwabuilder.com/?url=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Open PWABuilder for this App URL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* App Features Reminder */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="p-2 rounded-xl bg-slate-100/80 text-slate-700">
            <span className="font-extrabold block text-slate-900">Offline Capable</span>
            <span>Precached Assets</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-100/80 text-slate-700">
            <span className="font-extrabold block text-slate-900">Standalone</span>
            <span>No Browser UI</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-100/80 text-slate-700">
            <span className="font-extrabold block text-slate-900">Lightweight</span>
            <span>Fast &amp; Instant</span>
          </div>
        </div>

        {/* Close button */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
