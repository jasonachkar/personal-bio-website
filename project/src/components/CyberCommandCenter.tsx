import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Globe, AlertTriangle, CheckCircle, XCircle, Timer, RefreshCw } from 'lucide-react';

interface Endpoint {
  grade?: string;
  details?: {
    protocols?: { name: string; version: string }[];
    suites?: { list: { name: string }[] }[];
    cert?: {
      notAfter?: number;
      subject?: string;
      issuerLabel?: string;
    };
  };
}

interface SSLResult {
  host: string;
  status: string;
  endpoints: Endpoint[];
}

const SSLLabsAPI = 'https://api.ssllabs.com/api/v3/analyze?publish=off&fromCache=on&all=done&host=';

const gradeColors: Record<string, string> = {
  'A+': 'bg-green-500 text-white',
  'A': 'bg-green-400 text-white',
  'A-': 'bg-green-300 text-black',
  'B': 'bg-yellow-400 text-black',
  'C': 'bg-orange-400 text-black',
  'D': 'bg-red-400 text-white',
  'E': 'bg-red-600 text-white',
  'F': 'bg-red-800 text-white',
  'T': 'bg-gray-400 text-black',
  'M': 'bg-gray-400 text-black',
};

const CyberCommandCenter: React.FC = () => {
  const [ssl, setSSL] = useState<SSLResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchSSL = async () => {
      setLoading(true);
      setError(null);
      try {
        const host = window.location.hostname;
        const res = await fetch(`/.netlify/functions/sslgrade?host=${encodeURIComponent(host)}`);
        if (!res.ok) throw new Error('Failed to fetch SSL Labs data');
        const data = await res.json();
        if (data.status === 'ERROR') throw new Error(data.statusMessage || 'SSL Labs error');
        setSSL(data);
      } catch (e: any) {
        setError(e.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchSSL();
    // eslint-disable-next-line
  }, [refresh]);

  const endpoint = ssl?.endpoints?.[0];
  const grade = endpoint?.grade || 'T';
  const protocols = endpoint?.details?.protocols || [];
  const suites = endpoint?.details?.suites?.[0]?.list || [];
  const cert = endpoint?.details?.cert;
  const expiry = cert?.notAfter ? new Date(cert.notAfter) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 overflow-hidden max-w-xl mx-auto"
      role="region"
      aria-label="SSL/TLS Grade Widget"
    >
      <div className="bg-black/60 p-4 flex items-center space-x-2 border-b border-green-500/20">
        <Shield className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          SSL/TLS Security Grade
        </h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRefresh((r) => r + 1)}
          className="ml-auto text-green-400/70 hover:text-green-400 transition-colors"
          aria-label="Refresh SSL Grade"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <span className="text-green-400 font-mono">Analyzing SSL/TLS configuration...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <span className="text-red-400 font-mono">{error}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRefresh((r) => r + 1)}
              className="mt-4 px-4 py-2 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 font-mono border border-green-500/40"
            >
              Retry
            </motion.button>
          </div>
        ) : ssl ? (
          <>
            <div className="flex items-center gap-4">
              <div className={`rounded-full px-6 py-4 text-4xl font-mono font-bold shadow ${gradeColors[grade] || 'bg-gray-400 text-black'}`}
                aria-label={`SSL Grade: ${grade}`}
              >
                {grade}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-green-400">{ssl.host}</span>
                </div>
                <div className="flex items-center gap-2">
                  {grade === 'A+' || grade === 'A' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="font-mono text-green-400/80">{grade === 'A+' ? 'Excellent' : grade === 'A' ? 'Good' : 'Needs Improvement'}</span>
                </div>
                {expiry && (
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-green-400" />
                    <span className="font-mono text-green-400/80">Cert expires: {expiry.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-base font-mono text-green-400/80 mb-2">Supported Protocols</h4>
              <div className="flex flex-wrap gap-2">
                {protocols.length > 0 ? protocols.map((p, i) => (
                  <span key={i} className="px-3 py-1 rounded bg-green-500/10 text-green-400 font-mono text-sm border border-green-500/20">
                    {p.name} {p.version}
                  </span>
                )) : <span className="text-green-400/60 font-mono">N/A</span>}
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-base font-mono text-green-400/80 mb-2">Cipher Suites</h4>
              <div className="flex flex-wrap gap-2">
                {suites.length > 0 ? suites.map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 font-mono text-sm border border-cyan-500/20">
                    {s.name}
                  </span>
                )) : <span className="text-cyan-400/60 font-mono">N/A</span>}
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-base font-mono text-green-400/80 mb-2">Certificate</h4>
              <div className="flex flex-col gap-1 font-mono text-green-400/80">
                <span>Subject: {cert?.subject || 'N/A'}</span>
                <span>Issuer: {cert?.issuerLabel || 'N/A'}</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </motion.div>
  );
};

export default CyberCommandCenter; 