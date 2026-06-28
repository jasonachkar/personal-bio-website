export interface SecurityMetrics {
  incidentsBlocked: number;
  vulnerabilitiesFound: number;
  detectionsCreated: number;
  complianceScore: number;
  avgResponseTime: string;
  mitreCoverage: {
    tactics: number;
    techniques: number;
    totalTactics: number;
    totalTechniques: number;
  };
  timeline: SecurityEvent[];
}

export interface SecurityEvent {
  id: string;
  date: string;
  type: 'incident' | 'vulnerability' | 'detection' | 'compliance';
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface MetricsCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  description?: string;
}

