"use client"

import { useEffect, useMemo, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles required by @react-pdf-viewer
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface InnerProps {
  url: string;
}

export default function PdfViewerInner({ url }: InnerProps) {
  const [mounted, setMounted] = useState(false);

  // Align worker version with the one bundled by @react-pdf-viewer/core peer dep (pdfjs-dist@5.4.149)
  const PDF_WORKER_URL = 'https://unpkg.com/pdfjs-dist@5.4.149/build/pdf.worker.min.js';

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof window === 'undefined') return null;
  if (!url) return <div className="flex items-center justify-center h-full text-gray-400">No PDF URL</div>;

  // Create plugin instance only on client after mount
  const defaultLayoutPluginInstance = useMemo(() => defaultLayoutPlugin(), []);

  return (
    <Worker workerUrl={PDF_WORKER_URL}>
      <Viewer
        fileUrl={url}
        plugins={[defaultLayoutPluginInstance]}
        theme={{ theme: 'dark' }}
        renderError={(err) => (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-red-500 text-lg font-medium mb-2">Error loading PDF</div>
            <div className="text-gray-500 mb-4">{err.message}</div>
            <button
              onClick={() => window.open(url, '_blank')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Open PDF in new tab
            </button>
          </div>
        )}
      />
    </Worker>
  );
}
