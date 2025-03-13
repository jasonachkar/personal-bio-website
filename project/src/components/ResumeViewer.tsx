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
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        // Get the appropriate resume file based on language
        const filename = i18n.language === 'fr' ? 'resumefr.pdf' : 'resume.pdf';
        
        const { data, error } = await supabase
          .storage
          .from('publicbucket')
          .createSignedUrl(filename, 3600); // URL valid for 1 hour

        if (error) throw error;
        setPdfUrl(data.signedUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching resume URL:', error);
        setIsLoading(false);
      }
    };

    fetchResumeUrl();
  }, [i18n.language]); // Re-fetch when language changes

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const handleDownload = async () => {
    if (!pdfUrl) return;
    
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Set filename based on language
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-20 pb-16 px-4 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {i18n.language === 'fr' ? 'Mon CV' : 'My Resume'}
            </h2>
            <button
              onClick={handleDownload}
              disabled={!pdfUrl}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              {i18n.language === 'fr' ? 'Télécharger PDF' : 'Download PDF'}
            </button>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}

          {pdfUrl ? (
            <div className="flex justify-center">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              </Document>
            </div>
          ) : (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-600 dark:text-gray-400">
                {i18n.language === 'fr' 
                  ? 'Impossible de charger le CV. Veuillez réessayer plus tard.'
                  : 'Failed to load resume. Please try again later.'}
              </p>
            </div>
          )}

          {numPages && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <p className="text-gray-600 dark:text-gray-400">
                {i18n.language === 'fr' 
                  ? `Page ${pageNumber} sur ${numPages}`
                  : `Page ${pageNumber} of ${numPages}`}
              </p>
              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeViewer;