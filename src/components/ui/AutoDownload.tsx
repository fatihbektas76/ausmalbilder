"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface AutoDownloadProps {
  pdfUrl: string;
}

export default function AutoDownload({ pdfUrl }: AutoDownloadProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action") !== "download") return;

    // Open PDF in new tab for direct printing
    const timer = setTimeout(() => {
      window.open(pdfUrl, "_blank");
    }, 500);

    document.getElementById("download-section")?.scrollIntoView({
      behavior: "smooth",
    });

    return () => clearTimeout(timer);
  }, [searchParams, pdfUrl]);

  return null;
}
