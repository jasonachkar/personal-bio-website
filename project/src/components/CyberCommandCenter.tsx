import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Lock, Network, Terminal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SecurityAlert {
  id: string;
  timestamp: string;
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  details: string;
  icon: React.ReactNode;
}

const CyberCommandCenter: React.FC = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const securityAlerts: SecurityAlert[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'warning',
      message: 'Suspicious network activity detected',
      details: 'Multiple failed login attempts from IP: 192.168.1.100',
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      type: 'info',
      message: 'System encryption status',
      details: 'All sensitive data is encrypted using AES-256',
      icon: <Lock className="w-4 h-4 text-blue-500" />
    },
    {
      id: '3',
      timestamp: new Date().toISOString(),
      type: 'success',
      message: 'Firewall protection active',
      details: 'Real-time threat detection and blocking enabled',
      icon: <Shield className="w-4 h-4 text-green-500" />
    },
    {
      id: '4',
      timestamp: new Date().toISOString(),
      type: 'error',
      message: 'Potential DDoS attack detected',
      details: 'Unusual traffic patterns from multiple sources',
      icon: <Network className="w-4 h-4 text-red-500" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => {
        const newAlert = securityAlerts[Math.floor(Math.random() * securityAlerts.length)];
        return [...prev.slice(-4), { ...newAlert, timestamp: new Date().toISOString() }];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [alerts]);

  const getAlertColor = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
    >
      {/* Header */}
      <div className="bg-black/60 p-4 flex items-center justify-between border-b border-green-500/20">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-mono text-green-400">Cyber Command Center</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-400/70 hover:text-green-400 transition-colors"
          aria-label={isExpanded ? "Collapse terminal" : "Expand terminal"}
        >
          {isExpanded ? <X className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Terminal Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div
              ref={terminalRef}
              className="h-64 overflow-y-auto p-4 font-mono text-sm space-y-2 bg-black/40"
            >
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setSelectedAlert(alert)}
                  className="cursor-pointer hover:bg-green-500/5 p-2 rounded transition-colors border border-transparent hover:border-green-500/20"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400/50">[{new Date(alert.timestamp).toLocaleTimeString()}]</span>
                    <span className={getAlertColor(alert.type)}>{alert.icon}</span>
                    <span className="text-green-400">{alert.message}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Details Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/40 backdrop-blur-sm rounded-xl p-6 max-w-md w-full border border-green-500/20 shadow-[0_0_30px_rgba(0,255,0,0.1)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={getAlertColor(selectedAlert.type)}>{selectedAlert.icon}</span>
                  <h4 className="text-lg font-mono text-green-400">{selectedAlert.message}</h4>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-green-400/70 hover:text-green-400 transition-colors"
                  aria-label="Close alert details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-green-400/70 mb-4 font-mono">{selectedAlert.details}</p>
              <div className="text-xs text-green-400/50 font-mono">
                {new Date(selectedAlert.timestamp).toLocaleString()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CyberCommandCenter; 