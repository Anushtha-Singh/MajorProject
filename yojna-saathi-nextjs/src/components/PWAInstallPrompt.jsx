'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('pwa-d')) return;
    const h = (e) => { e.preventDefault(); setDeferredPrompt(e); setTimeout(() => setShow(true), 5000); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  const install = async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; setShow(false); };
  const dismiss = () => { setShow(false); localStorage.setItem('pwa-d', '1'); };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 z-[60] flex justify-center sm:justify-end">
      <div className="w-full max-w-[340px] bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-black/5 flex items-start gap-3.5 sm:gap-4 animate-in slide-in-from-bottom-5 duration-300">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#0271BC] to-[#1E90FF] flex items-center justify-center shrink-0 shadow-sm">
          <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="text-[15px] sm:text-base font-extrabold text-gray-900 tracking-tight">Install Yojna Saathi</div>
          <div className="text-xs sm:text-sm font-medium text-gray-500 mt-1">Faster access & offline support</div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={install} className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#0271BC] to-[#1E90FF] text-white rounded-full px-4 py-2 text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Install
            </button>
            <button onClick={dismiss} className="text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
              Later
            </button>
          </div>
        </div>
        <button onClick={dismiss} className="p-1.5 rounded-full hover:bg-gray-100 shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
