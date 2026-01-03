export interface CaseStudy {
  id: string;
  title: string;
  category: 'security' | 'cloud' | 'compliance' | 'detection';
  problem: string;
  analysis: string;
  solution: string;
  impact: ImpactMetrics;
  technologies: string[];
  lessonsLearned: string[];
  date: string;
  duration: string;
  status: 'completed' | 'in-progress';
}

export interface ImpactMetrics {
  before: {
    incidentsPerMonth: number;
    complianceScore: number;
    avgResponseTime: string;
    vulnerabilities: number;
  };
  after: {
    incidentsPerMonth: number;
    complianceScore: number;
    avgResponseTime: string;
    vulnerabilities: number;
  };
  improvement: {
    incidentsReduction: string;
    complianceIncrease: string;
    responseTimeImprovement: string;
    vulnerabilitiesFixed: string;
  };
}

