"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

// Note: We use a simple <iframe> preview to avoid pdfjs SSR/runtime issues

interface PDFViewerProps {
  url: string;
  title?: string;
  onClose: () => void;
}

export default function PDFViewerNew({ url, title = 'PDF Viewer', onClose }: PDFViewerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  // Keep hooks ordering stable; no conditional early return

  // Create a blob URL to bypass X-Frame-Options on route responses
  useEffect(() => {
    let revoked = false;
    let currentUrl: string | null = null;
    const load = async () => {
      if (!url) {
        setBlobUrl(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch PDF (${res.status})`);
        const blob = await res.blob();
        // Ensure it's a PDF
        const type = blob.type || 'application/pdf';
        const pdfBlob = type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(pdfBlob);
        currentUrl = objectUrl;
        if (!revoked) setBlobUrl(objectUrl);
      } catch (e: any) {
        setError(e?.message ?? 'Unable to load PDF');
        setBlobUrl(null);
      } finally {
        if (!revoked) setLoading(false);
      }
    };
    load();
    return () => {
      revoked = true;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [url]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-6xl h-[90vh] p-0 overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</DialogTitle>
          </div>
          <div className="flex-1 overflow-hidden">
            {!url && (
              <div className="flex items-center justify-center h-full text-gray-400">No PDF URL provided</div>
            )}
            {url && loading && (
              <div className="flex items-center justify-center h-full text-gray-400">Loading PDF…</div>
            )}
            {url && !loading && error && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="text-red-500 mb-2">{error}</div>
                <button
                  onClick={() => window.open(url, '_blank')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Open in new tab
                </button>
              </div>
            )}
            {url && !loading && !error && blobUrl && (
              <iframe
                title={title}
                src={`${blobUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full"
                loading="eager"
                style={{ border: 'none' }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Loading component for better UX
export function PDFLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );
}
