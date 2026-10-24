import React, { useState } from 'react';
import { X, Check, Smartphone, Package, Github, FileArchive } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { playSoundEffect } from '../utils/audio';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'apk'>('install');
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipDone, setZipDone] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    playSoundEffect('pop');
    const result = await install();
    if (result) {
      onClose();
    }
  };

  const handleDownloadReadyZip = async () => {
    playSoundEffect('pop');
    setDownloadingZip(true);
    try {
      const response = await fetch('/littlelearners-abc-ready.zip');
      if (!response.ok) throw new Error('Failed to fetch zip');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'littlelearners-abc-ready.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setZipDone(true);
      setTimeout(() => setZipDone(false), 4000);
    } catch {
      const a = document.createElement('a');
      a.href = '/littlelearners-abc-ready.zip';
      a.download = 'littlelearners-abc-ready.zip';
      a.click();
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-5 sm:p-7 my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <img
            src="/pwa-192x192.png"
            alt="LittleLearners ABC"
            className="w-14 h-14 rounded-2xl shadow-md shrink-0"
          />
          <div>
            <h3 className="font-display font-black text-lg sm:text-xl text-slate-900">
              LittleLearners ABC
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Install on Phone, Tablet, or Build Android APK
            </p>
          </div>
        </div>

        {/* Direct Install Button if browser supports PWA install */}
        {isInstallable && (
          <button
            onClick={handleInstallClick}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-md flex items-center justify-center gap-2 mb-4 active:scale-95 transition-all cursor-pointer"
          >
            <Smartphone className="w-5 h-5" />
            <span>Install LittleLearners ABC Now</span>
          </button>
        )}

        {isInstalled && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>LittleLearners ABC is installed on this device!</span>
          </div>
        )}

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-4 border border-slate-200">
          <button
            onClick={() => setActiveTab('install')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'install'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Install on Device</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>APK / Host Package</span>
          </button>
        </div>

        {activeTab === 'install' ? (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 leading-relaxed">
              <strong className="text-slate-900 block font-bold mb-1">
                Android (Google Chrome):
              </strong>
              Tap the <strong>3 dots (⋮)</strong> at the top-right of Chrome and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 leading-relaxed">
              <strong className="text-slate-900 block font-bold mb-1">
                iPhone & iPad (Safari):
              </strong>
              Tap the <strong>Share (⎋)</strong> button at the bottom of Safari, scroll down, and tap <strong>"Add to Home Screen"</strong>.
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 leading-relaxed">
              <strong className="text-slate-900 block font-bold mb-1">
                Desktop / Chromebook (Chrome / Edge):
              </strong>
              Click the <strong>Install icon (⊕)</strong> on the right side of the browser address bar.
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-slate-700">
            <button
              onClick={handleDownloadReadyZip}
              disabled={downloadingZip}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-display font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              {zipDone ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Downloaded (littlelearners-abc-ready.zip)</span>
                </>
              ) : (
                <>
                  <FileArchive className="w-5 h-5" />
                  <span>
                    {downloadingZip
                      ? 'Preparing Package...'
                      : 'Download Ready Web Build (.ZIP)'}
                  </span>
                </>
              )}
            </button>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 leading-relaxed">
              <strong className="text-slate-900 block font-bold mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" /> Automatic GitHub APK Builder:
              </strong>
              Save this project to a <strong>Public</strong> GitHub repo (`little-learners-abc`) → GitHub Actions automatically compiles and publishes <strong>LittleLearners-ABC.apk</strong> under <strong>Releases</strong>!
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 leading-relaxed">
              <strong className="text-slate-900 block font-bold mb-1">
                Netlify Drop + PWABuilder:
              </strong>
              Drop the downloaded ZIP at <strong>app.netlify.com/drop</strong> for an instant public URL, or package it into an Android APK at <strong>pwabuilder.com</strong>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
