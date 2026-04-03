"use client";

import { useState, useCallback, useEffect } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageDataUrl: string | null;
  imageTitle: string;
  imageSlug: string;
  category: string;
}

type ShareFormat = "pinterest" | "instagram" | "whatsapp" | "standard";

const BASE_URL = "https://ausmalbilder-gratis.com";

export default function ShareModal({
  isOpen,
  onClose,
  imageDataUrl,
  imageTitle,
  imageSlug,
  category,
}: ShareModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ShareFormat>("standard");
  const [copied, setCopied] = useState(false);
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);

  // Check for native share support (client-side only)
  useEffect(() => {
    setSupportsNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }, []);

  const pageUrl = `${BASE_URL}/${category}/${imageSlug}`;

  const shareDescription = `${imageTitle} Ausmalbild kostenlos — ausmalbilder-gratis.com`;

  const formatLabels: Record<ShareFormat, string> = {
    pinterest: "Pinterest (1000x1500)",
    instagram: "Instagram Story (1080x1920)",
    whatsapp: "WhatsApp (1080x1080)",
    standard: "Standard PNG",
  };

  // ------------------------------------------------------------------
  // Copy link to clipboard
  // ------------------------------------------------------------------
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = pageUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [pageUrl]);

  // ------------------------------------------------------------------
  // Native Web Share API
  // ------------------------------------------------------------------
  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;

    const shareData: ShareData = {
      title: `${imageTitle} — Ausmalbild`,
      text: `Schau mal was ich ausgemalt habe! ${shareDescription}`,
      url: pageUrl,
    };

    // Attempt to share the image blob if supported
    if (imageDataUrl) {
      try {
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const file = new File([blob], `${imageSlug}-ausmalbild.png`, {
          type: "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
      } catch {
        // If blob conversion fails, share without the file
      }
    }

    try {
      await navigator.share(shareData);
    } catch {
      // User cancelled or share failed — silently ignore
    }
  }, [imageDataUrl, imageTitle, imageSlug, shareDescription, pageUrl]);

  // ------------------------------------------------------------------
  // Platform-specific share URLs
  // ------------------------------------------------------------------
  const openPinterest = () => {
    const url = new URL("https://pinterest.com/pin/create/button/");
    url.searchParams.set("url", pageUrl);
    url.searchParams.set("description", shareDescription);
    if (imageDataUrl) {
      url.searchParams.set("media", imageDataUrl);
    }
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  const openWhatsApp = () => {
    const text = `Schau mal was ich ausgemalt habe! ${pageUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ------------------------------------------------------------------
  // Download the image in selected format
  // ------------------------------------------------------------------
  const handleDownload = useCallback(() => {
    if (!imageDataUrl) return;

    // For a full implementation, the image would be resized to the
    // selected format dimensions server-side or via an offscreen canvas.
    // Here we provide the standard export and note the intended size.
    const link = document.createElement("a");
    link.href = imageDataUrl;
    link.download = `${imageSlug}-${selectedFormat}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageDataUrl, imageSlug, selectedFormat]);

  // ------------------------------------------------------------------
  // Close on Escape key
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ------------------------------------------------------------------
  // Prevent body scroll when open
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F6F2] text-[#1D1448] transition-colors hover:bg-[#1D1448]/10"
          aria-label="Schliessen"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="mb-4 text-xl font-bold tracking-tight text-[#1D1448]">
          Ausmalbild teilen
        </h2>

        {/* Image preview */}
        {imageDataUrl && (
          <div className="mb-4 overflow-hidden rounded-lg border border-[#1D1448]/10 bg-[#F7F6F2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt={`${imageTitle} — ausgemaltes Bild`}
              className="mx-auto max-h-64 w-auto object-contain"
            />
          </div>
        )}

        {/* Watermark notice */}
        <p className="mb-4 text-xs text-[#1D1448]/50">
          Alle exportierten Bilder enthalten ein dezentes Wasserzeichen.
        </p>

        {/* Format selection */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-[#1D1448]">
            Exportformat
          </h3>
          <div className="flex flex-wrap gap-2">
            {(
              Object.entries(formatLabels) as [ShareFormat, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedFormat(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedFormat === key
                    ? "bg-[#E8490F] text-white"
                    : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#E8490F]/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={!imageDataUrl}
          className="mb-5 w-full rounded-lg bg-[#1D1448] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D1448]/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {selectedFormat === "standard"
            ? "PNG herunterladen"
            : `Als ${formatLabels[selectedFormat]} herunterladen`}
        </button>

        {/* Divider */}
        <div className="mb-5 border-t border-[#1D1448]/10" />

        {/* Share buttons */}
        <h3 className="mb-3 text-sm font-medium text-[#1D1448]">
          Direkt teilen
        </h3>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {/* Pinterest */}
          <button
            onClick={openPinterest}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#E60023]/10 px-3 py-2.5 text-sm font-medium text-[#E60023] transition-colors hover:bg-[#E60023]/20"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
            Pinterest
          </button>

          {/* WhatsApp */}
          <button
            onClick={openWhatsApp}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/10 px-3 py-2.5 text-sm font-medium text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>

          {/* Facebook */}
          <button
            onClick={openFacebook}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#1877F2]/10 px-3 py-2.5 text-sm font-medium text-[#1877F2] transition-colors hover:bg-[#1877F2]/20"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#F7F6F2] px-3 py-2.5 text-sm font-medium text-[#1D1448] transition-colors hover:bg-[#1D1448]/10"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "Kopiert!" : "Link kopieren"}
          </button>
        </div>

        {/* Native share */}
        {supportsNativeShare && (
          <button
            onClick={handleNativeShare}
            className="w-full rounded-lg border border-[#E8490F] py-2.5 text-sm font-semibold text-[#E8490F] transition-colors hover:bg-[#E8490F]/5"
          >
            Teilen
          </button>
        )}
      </div>
    </div>
  );
}
