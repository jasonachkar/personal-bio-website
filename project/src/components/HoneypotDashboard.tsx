import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Network, Database, Terminal, X, Activity, Lock, Server, AlertCircle, Cpu, HardDrive, Wifi, FileCode, Bug, Bot, Key, FileSearch, Code2, FileJson, FileText, FileCheck, FileX, FileScan, FileUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AttackLog {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceIP: string;
  targetPort: number;
  attackDetails: {
    description: string;
    mitigation: string[];
    indicators: string[];
    technicalDetails: {
      payload?: string;
      headers?: Record<string, string>;
      protocol?: string;
      method?: string;
      userAgent?: string;
      requestPath?: string;
      responseCode?: number;
      attackVector?: string;
      vulnerability?: string;
      cve?: string;
    };
  };
  icon: React.ReactNode;
}

interface AttackStats {
  totalAttacks: number;
  activeThreats: number;
  blockedAttempts: number;
  uniqueIPs: Set<string>;
  attackTypes: Record<string, number>;
  severityDistribution: Record<string, number>;
  recentActivity: {
    timestamp: string;
    count: number;
  }[];
  topSourceIPs: Array<{ ip: string; count: number }>;
  topTargetPorts: Array<{ port: number; count: number }>;
}

const HoneypotDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<AttackLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AttackLog | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState<AttackStats>({
    totalAttacks: 0,
    activeThreats: 0,
    blockedAttempts: 0,
    uniqueIPs: new Set<string>(),
    attackTypes: {},
    severityDistribution: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    },
    recentActivity: [],
    topSourceIPs: [],
    topTargetPorts: []
  });
  const terminalRef = useRef<HTMLDivElement>(null);

  const attackTypes: AttackLog[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'port_scan',
      severity: 'medium',
      sourceIP: '192.168.1.100',
      targetPort: 22,
      attackDetails: {
        description: 'Port scanning is a reconnaissance technique used to identify open ports and services on a target system. Attackers use this information to identify potential vulnerabilities.',
        mitigation: [
          'Implement port scanning detection',
          'Use firewall rules to restrict access',
          'Regular security audits'
        ],
        indicators: [
          'Multiple connection attempts to different ports',
          'Rapid sequential port scanning',
          'Unusual traffic patterns'
        ],
        technicalDetails: {
          protocol: 'TCP',
          method: 'SYN Scan',
          payload: 'SYN packet',
          headers: {
            'TCP Flags': 'SYN',
            'Window Size': '1024',
            'TTL': '64'
          }
        }
      },
      icon: <Network className="w-4 h-4 text-yellow-500" />
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      type: 'brute_force',
      severity: 'high',
      sourceIP: '192.168.1.101',
      targetPort: 3389,
      attackDetails: {
        description: 'Brute force attacks attempt to gain unauthorized access by systematically trying different password combinations until the correct one is found.',
        mitigation: [
          'Implement account lockout policies',
          'Use strong password requirements',
          'Enable multi-factor authentication'
        ],
        indicators: [
          'Multiple failed login attempts',
          'Rapid password attempts',
          'Account lockout events'
        ],
        technicalDetails: {
          protocol: 'RDP',
          method: 'Password Guessing',
          payload: 'Login attempt',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Authentication Type': 'NTLM'
          }
        }
      },
      icon: <Lock className="w-4 h-4 text-red-500" />
    },
    {
      id: '3',
      timestamp: new Date().toISOString(),
      type: 'sql_injection',
      severity: 'critical',
      sourceIP: '192.168.1.102',
      targetPort: 3306,
      attackDetails: {
        description: 'SQL injection attacks attempt to manipulate database queries by injecting malicious SQL code, potentially allowing unauthorized access to data.',
        mitigation: [
          'Use parameterized queries',
          'Implement input validation',
          'Regular security testing'
        ],
        indicators: [
          'Unusual SQL query patterns',
          'Database error messages',
          'Suspicious input characters'
        ],
        technicalDetails: {
          protocol: 'MySQL',
          method: 'Error-based SQL Injection',
          payload: "' OR '1'='1",
          vulnerability: 'CWE-89: SQL Injection',
          cve: 'CVE-2023-1234',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'sqlmap/1.6.12'
          }
        }
      },
      icon: <Database className="w-4 h-4 text-red-500" />
    },
    {
      id: '4',
      timestamp: new Date().toISOString(),
      type: 'ddos',
      severity: 'high',
      sourceIP: '192.168.1.103',
      targetPort: 80,
      attackDetails: {
        description: 'Distributed Denial of Service attacks overwhelm a system with traffic from multiple sources, rendering it unavailable to legitimate users.',
        mitigation: [
          'Implement DDoS protection',
          'Use traffic filtering',
          'Configure rate limiting'
        ],
        indicators: [
          'Unusual traffic volume',
          'Multiple source IPs',
          'Service degradation'
        ],
        technicalDetails: {
          protocol: 'HTTP',
          method: 'GET Flood',
          payload: 'HTTP GET requests',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': '*/*',
            'Connection': 'keep-alive'
          }
        }
      },
      icon: <Server className="w-4 h-4 text-orange-500" />
    },
    {
      id: '5',
      timestamp: new Date().toISOString(),
      type: 'xss',
      severity: 'high',
      sourceIP: '192.168.1.104',
      targetPort: 443,
      attackDetails: {
        description: 'Cross-Site Scripting (XSS) attacks inject malicious scripts into web pages viewed by other users, potentially compromising their browsers.',
        mitigation: [
          'Implement Content Security Policy (CSP)',
          'Sanitize user input',
          'Use proper output encoding'
        ],
        indicators: [
          'Suspicious JavaScript payloads',
          'Unusual HTML content',
          'Malicious script execution'
        ],
        technicalDetails: {
          protocol: 'HTTPS',
          method: 'Reflected XSS',
          payload: '<script>alert("XSS")</script>',
          vulnerability: 'CWE-79: Cross-site Scripting',
          cve: 'CVE-2023-5678',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        }
      },
      icon: <FileCode className="w-4 h-4 text-red-500" />
    },
    {
      id: '6',
      timestamp: new Date().toISOString(),
      type: 'file_upload',
      severity: 'critical',
      sourceIP: '192.168.1.105',
      targetPort: 21,
      attackDetails: {
        description: 'Malicious file upload attacks attempt to upload and execute malicious files on the server, potentially gaining unauthorized access.',
        mitigation: [
          'Implement file type validation',
          'Use secure file storage',
          'Scan uploaded files'
        ],
        indicators: [
          'Suspicious file types',
          'Large file uploads',
          'Malicious file execution'
        ],
        technicalDetails: {
          protocol: 'FTP',
          method: 'Malicious File Upload',
          payload: 'shell.php',
          vulnerability: 'CWE-434: Unrestricted Upload of File with Dangerous Type',
          cve: 'CVE-2023-9012',
          headers: {
            'Content-Type': 'application/octet-stream',
            'User-Agent': 'FileZilla/3.60.0'
          }
        }
      },
      icon: <FileUp className="w-4 h-4 text-red-500" />
    },
    {
      id: '7',
      timestamp: new Date().toISOString(),
      type: 'command_injection',
      severity: 'critical',
      sourceIP: '192.168.1.106',
      targetPort: 8080,
      attackDetails: {
        description: 'Command injection attacks attempt to execute arbitrary commands on the host operating system through a vulnerable application.',
        mitigation: [
          'Use parameterized commands',
          'Implement input validation',
          'Restrict command execution'
        ],
        indicators: [
          'Suspicious command characters',
          'System command execution',
          'Unusual process creation'
        ],
        technicalDetails: {
          protocol: 'HTTP',
          method: 'OS Command Injection',
          payload: '; rm -rf /',
          vulnerability: 'CWE-78: OS Command Injection',
          cve: 'CVE-2023-3456',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'curl/7.88.1'
          }
        }
      },
      icon: <Terminal className="w-4 h-4 text-red-500" />
    },
    {
      id: '8',
      timestamp: new Date().toISOString(),
      type: 'path_traversal',
      severity: 'high',
      sourceIP: '192.168.1.107',
      targetPort: 80,
      attackDetails: {
        description: 'Path traversal attacks attempt to access files and directories outside the intended web root directory.',
        mitigation: [
          'Implement path validation',
          'Use secure file access methods',
          'Restrict file system access'
        ],
        indicators: [
          'Suspicious path characters',
          'Unauthorized file access',
          'Directory traversal attempts'
        ],
        technicalDetails: {
          protocol: 'HTTP',
          method: 'Directory Traversal',
          payload: '../../../etc/passwd',
          vulnerability: 'CWE-22: Path Traversal',
          cve: 'CVE-2023-7890',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        }
      },
      icon: <FileSearch className="w-4 h-4 text-orange-500" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate varying levels of activity
      const activityLevel = Math.random();
      
      if (activityLevel > 0.7) { // 30% chance of attack
        setLogs(prev => {
          const newLog = attackTypes[Math.floor(Math.random() * attackTypes.length)];
          const updatedLog = {
            ...newLog,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            targetPort: Math.floor(Math.random() * 65535)
          };
          
          // Update stats
          setStats(prevStats => {
            const newStats = {
              ...prevStats,
              totalAttacks: prevStats.totalAttacks + 1,
              activeThreats: prevStats.activeThreats + 1,
              blockedAttempts: prevStats.blockedAttempts + 1,
              uniqueIPs: new Set([...prevStats.uniqueIPs, updatedLog.sourceIP]),
              attackTypes: {
                ...prevStats.attackTypes,
                [updatedLog.type]: (prevStats.attackTypes[updatedLog.type] || 0) + 1
              },
              severityDistribution: {
                ...prevStats.severityDistribution,
                [updatedLog.severity]: prevStats.severityDistribution[updatedLog.severity] + 1
              }
            };

            // Update recent activity
            const now = new Date();
            const recentActivity = [...prevStats.recentActivity];
            const lastActivity = recentActivity[recentActivity.length - 1];
            
            if (lastActivity && now.getTime() - new Date(lastActivity.timestamp).getTime() < 60000) {
              lastActivity.count++;
            } else {
              recentActivity.push({ timestamp: now.toISOString(), count: 1 });
            }

            // Keep only last 10 minutes of activity
            while (recentActivity.length > 10) {
              recentActivity.shift();
            }

            // Update top source IPs
            const ipCounts = new Map<string, number>();
            [...newStats.uniqueIPs].forEach(ip => {
              ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1);
            });
            newStats.topSourceIPs = Array.from(ipCounts.entries())
              .map(([ip, count]) => ({ ip, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);

            // Update top target ports
            const portCounts = new Map<number, number>();
            logs.forEach(log => {
              portCounts.set(log.targetPort, (portCounts.get(log.targetPort) || 0) + 1);
            });
            newStats.topTargetPorts = Array.from(portCounts.entries())
              .map(([port, count]) => ({ port, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);

            return newStats;
          });

          return [...prev.slice(-10), updatedLog];
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getSeverityColor = (severity: AttackLog['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-black/60 p-4 flex items-center justify-between border-b border-green-500/20">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Honeypot Dashboard</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-400/70 hover:text-green-400 transition-colors"
          aria-label={isExpanded ? "Collapse dashboard" : "Expand dashboard"}
        >
          {isExpanded ? <X className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Stats Bar */}
      <div className="bg-black/40 p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-green-500/20">
        <div className="text-center">
          <div className="text-2xl font-mono text-green-400">{stats.totalAttacks}</div>
          <div className="text-xs text-green-400/70 font-mono">Total Attacks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono text-orange-400">{stats.activeThreats}</div>
          <div className="text-xs text-green-400/70 font-mono">Active Threats</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono text-green-500">{stats.blockedAttempts}</div>
          <div className="text-xs text-green-400/70 font-mono">Blocked</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono text-cyan-400">{stats.uniqueIPs.size}</div>
          <div className="text-xs text-green-400/70 font-mono">Unique IPs</div>
        </div>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/40 border-b border-green-500/20">
        <div>
          <h4 className="text-sm font-mono text-green-400/70 mb-2">Attack Distribution</h4>
          <div className="space-y-2">
            {Object.entries(stats.attackTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-green-400/80 font-mono">{type.replace('_', ' ').toUpperCase()}</span>
                <span className="text-sm font-mono text-cyan-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-mono text-green-400/70 mb-2">Severity Distribution</h4>
          <div className="space-y-2">
            {Object.entries(stats.severityDistribution).map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between">
                <span className={`text-sm font-mono ${getSeverityColor(severity as AttackLog['severity'])}`}>
                  {severity.toUpperCase()}
                </span>
                <span className="text-sm font-mono text-cyan-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Graph */}
      <div className="p-4 bg-black/40 border-b border-green-500/20">
        <h4 className="text-sm font-mono text-green-400/70 mb-2">Recent Activity</h4>
        <div className="h-20 flex items-end justify-between space-x-1">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="flex-1">
              <div
                className="bg-green-500/30 rounded-t border border-green-500/20"
                style={{ height: `${(activity.count / Math.max(...stats.recentActivity.map(a => a.count))) * 100}%` }}
              />
              <div className="text-xs text-green-400/50 text-center mt-1 font-mono">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Content */}
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
              className="h-96 overflow-y-auto p-4 font-mono text-sm space-y-2 bg-black/40"
            >
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setSelectedLog(log)}
                  className="cursor-pointer hover:bg-green-500/5 p-2 rounded transition-colors border border-green-500/10 hover:border-green-500/20"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400/50">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={getSeverityColor(log.severity)}>{log.icon}</span>
                    <span className="text-green-400">{log.type.replace('_', ' ').toUpperCase()}</span>
                    <span className="text-green-400/70">from</span>
                    <span className="text-cyan-400">{log.sourceIP}</span>
                    <span className="text-green-400/70">port</span>
                    <span className="text-purple-400">{log.targetPort}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attack Details Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedLog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/90 rounded-xl p-6 max-w-2xl w-full border border-green-500/20 shadow-[0_0_30px_rgba(0,255,0,0.1)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={getSeverityColor(selectedLog.severity)}>{selectedLog.icon}</span>
                  <h4 className="text-lg font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    {selectedLog.type.replace('_', ' ').toUpperCase()} Attack
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-green-400/70 hover:text-green-400 transition-colors"
                  aria-label="Close attack details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-mono text-green-400/70 mb-2">Attack Details</h5>
                  <p className="text-green-400/80 font-mono">{selectedLog.attackDetails.description}</p>
                </div>

                <div>
                  <h5 className="text-sm font-mono text-green-400/70 mb-2">Technical Details</h5>
                  <div className="bg-black/60 p-4 rounded-lg font-mono text-sm border border-green-500/20">
                    <pre className="text-green-400/80 whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.attackDetails.technicalDetails, null, 2)}
                    </pre>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-mono text-green-400/70 mb-2">Mitigation Strategies</h5>
                  <ul className="list-disc list-inside text-green-400/80 space-y-1 font-mono">
                    {selectedLog.attackDetails.mitigation.map((strategy, index) => (
                      <li key={index}>{strategy}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-mono text-green-400/70 mb-2">Indicators of Compromise</h5>
                  <ul className="list-disc list-inside text-green-400/80 space-y-1 font-mono">
                    {selectedLog.attackDetails.indicators.map((indicator, index) => (
                      <li key={index}>{indicator}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-green-400/50 font-mono">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HoneypotDashboard; 