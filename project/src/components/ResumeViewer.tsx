import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResumeViewer = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1.2);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        setIsLoading(true);
        const filename = i18n.language === 'fr' ? 'resumefr.pdf' : 'resume.pdf';
        
        // Try to get a public URL first, which is more reliable
        const { data: publicUrlData } = await supabase
          .storage
          .from('publicbucket')
          .getPublicUrl(filename);

        if (publicUrlData && publicUrlData.publicUrl) {
          console.log('Using public URL:', publicUrlData.publicUrl);
          setPdfUrl(publicUrlData.publicUrl);
        } else {
          // Fallback to signed URL if public URL isn't available
          console.log('Public URL not available, trying signed URL...');
          const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('publicbucket')
            .createSignedUrl(filename, 3600);

          if (signedUrlError) throw signedUrlError;
          console.log('Using signed URL:', signedUrlData.signedUrl);
          setPdfUrl(signedUrlData.signedUrl);
        }
      } catch (error) {
        console.error('Error fetching resume URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeUrl();
  }, [i18n.language]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const handleDownload = async () => {
    if (!pdfUrl) return;
    
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = i18n.language === 'fr' ? 'JasonAchkarDiab-CV.pdf' : 'JasonAchkarDiab-Resume.pdf';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-[#0a0a0a] bg-opacity-95 relative">
      {/* Matrix-like Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-3xl animate-pulse" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {i18n.language === 'fr' ? 'Mon CV' : 'My Resume'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={!pdfUrl}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/40 font-mono"
            >
              <Download className="w-5 h-5 mr-2" />
              {i18n.language === 'fr' ? 'Télécharger PDF' : 'Download PDF'}
            </motion.button>
          </div>

          {/* PDF Viewer Container */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-green-500/20">
            {isLoading ? (
              <div className="flex justify-center items-center h-[800px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="flex justify-center">
                {pdfUrl ? (
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex justify-center items-center h-[800px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                      </div>
                    }
                    error={
                      <div className="flex flex-col items-center justify-center h-[800px] text-red-400">
                        <p className="font-mono">Failed to load PDF</p>
                        <button 
                          onClick={() => window.location.reload()} 
                          className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/40 font-mono"
                        >
                          Try again
                        </button>
                      </div>
                    }
                    options={{
                      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
                      cMapPacked: true,
                    }}
                  >
                    <Page
                      pageNumber={pageNumber}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={scale}
                      width={Math.min(window.innerWidth - 200, 1000)}
                      className="shadow-lg bg-white"
                    />
                  </Document>
                ) : (
                  <div className="flex justify-center items-center h-[800px]">
                    <div className="text-center">
                      <p className="text-green-400/70 font-mono mb-4">
                        {i18n.language === 'fr' 
                          ? 'Impossible de charger le CV. Veuillez réessayer plus tard.'
                          : 'Failed to load resume. Please try again later.'}
                      </p>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors border border-green-500/40 font-mono"
                      >
                        {i18n.language === 'fr' ? 'Réessayer' : 'Retry'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          {numPages && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                title={i18n.language === 'fr' ? 'Page précédente' : 'Previous page'}
                className="p-2 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <p className="text-green-400/70 font-mono">
                {i18n.language === 'fr' 
                  ? `Page ${pageNumber} sur ${numPages}`
                  : `Page ${pageNumber} of ${numPages}`}
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => changePage(1)}
                disabled={pageNumber >= numPages}
                title={i18n.language === 'fr' ? 'Page suivante' : 'Next page'}
                className="p-2 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/20"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeViewer;