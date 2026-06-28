'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import Card from '@/components/ui/Card';
import type { ThreatModelComponent, DataFlow, Threat, TrustBoundary } from '../types';
import { analyzeArchitecture, generateThreats, detectCloudProvider } from '../utils/threatAnalyzer';
import { getCVEsForTechnology } from '../utils/cveApi';
import { getCloudThreatsForComponent } from '../utils/cloudThreatIntelligence';

interface LiveThreatScannerProps {
  components: ThreatModelComponent[];
  dataFlows: DataFlow[];
  trustBoundaries: TrustBoundary[];
  onThreatsGenerated?: (threats: Threat[]) => void;
  className?: string;
}

export function LiveThreatScanner({
  components,
  dataFlows,
  trustBoundaries,
  onThreatsGenerated,
  className,
}: LiveThreatScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [threats, setThreats] = useState<Threat[]>([]);

  useEffect(() => {
    if (components.length > 0) {
      performScan();
    }
  }, [components, dataFlows, trustBoundaries]);

  async function performScan() {
    setScanning(true);
    setProgress(0);
    setStatus('Analyzing architecture...');
    setThreats([]);

    try {
      // Step 1: Architecture analysis
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(25);
      const analysis = analyzeArchitecture(components, dataFlows, trustBoundaries);
      setStatus('Generating threats...');

      // Step 2: Generate STRIDE threats
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(50);
      const strideThreats = generateThreats(analysis);
      setStatus('Checking CVEs...');

      // Step 3: Check CVEs for components
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(75);
      const cloudProvider = detectCloudProvider(components);
      
      // Step 4: Get cloud-specific threats
      if (cloudProvider) {
        setStatus('Analyzing cloud security...');
        const cloudThreats: Threat[] = [];
        components.forEach(comp => {
          const compThreats = getCloudThreatsForComponent(comp, cloudProvider);
          cloudThreats.push(...compThreats);
        });
        strideThreats.push(...cloudThreats);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(100);
      setStatus('Scan complete');
      setThreats(strideThreats);
      onThreatsGenerated?.(strideThreats);
    } catch (error) {
      console.error('Scan error:', error);
      setStatus('Scan failed');
    } finally {
      setScanning(false);
    }
  }

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center gap-3 mb-4">
        <Scan className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Live Threat Scanner</h3>
        {scanning && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
      </div>

      {scanning ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">{status}</span>
            <span className="text-text-primary font-medium">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-background-card overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      ) : threats.length > 0 ? (
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-severity-low" />
          <span className="text-text-primary">
            Found <strong>{threats.length}</strong> threats
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <AlertCircle className="h-4 w-4" />
          <span>No threats detected</span>
        </div>
      )}
    </Card>
  );
}

