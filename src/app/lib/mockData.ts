export type DashboardData = {
  nationalAverage: number;
  highestRiskDistrict: string;
  fiveYearProjection: number;
  confidenceScore: number;
  dataQuality: number;
  topDistricts: Array<{ district: string; score: number }>;
  migrationTrend: Array<{ year: string; value: number }>;
};

export function getMockDashboardData(): DashboardData {
  return {
    nationalAverage: 0.62,
    highestRiskDistrict: 'District A',
    fiveYearProjection: 482_000,
    confidenceScore: 87.4,
    dataQuality: 93,
    topDistricts: [
      { district: 'District A', score: 0.91 },
      { district: 'District D', score: 0.86 },
      { district: 'District B', score: 0.82 },
      { district: 'District F', score: 0.79 },
      { district: 'District C', score: 0.76 },
    ],
    migrationTrend: [
      { year: '2019', value: 71_000 },
      { year: '2020', value: 74_500 },
      { year: '2021', value: 78_200 },
      { year: '2022', value: 80_100 },
      { year: '2023', value: 84_900 },
      { year: '2024', value: 88_300 },
      { year: '2025', value: 92_600 },
    ],
  };
}

export type ForecastData = {
  totalProjection: number;
  annualGrowth: number;
  rmse: number;
  mae: number;
  confidence: number;
  timeSeriesData: Array<{
    year: string;
    actual?: number;
    forecast?: number;
    lowerBound?: number;
    upperBound?: number;
  }>;
  yearlyBreakdown: Array<{
    year: string;
    forecast: number;
    lowerBound: number;
    upperBound: number;
    growth: number;
  }>;
};

export function getMockForecastData(): ForecastData {
  const historical = [
    { year: '2019', actual: 71_000 },
    { year: '2020', actual: 74_500 },
    { year: '2021', actual: 78_200 },
    { year: '2022', actual: 80_100 },
    { year: '2023', actual: 84_900 },
    { year: '2024', actual: 88_300 },
    { year: '2025', actual: 92_600 },
  ];

  const forecastYears = [
    { year: '2026', forecast: 97_300, growth: 5.1 },
    { year: '2027', forecast: 101_800, growth: 4.6 },
    { year: '2028', forecast: 106_900, growth: 5.0 },
    { year: '2029', forecast: 111_600, growth: 4.4 },
    { year: '2030', forecast: 116_900, growth: 4.7 },
    { year: '2031', forecast: 121_500, growth: 3.9 },
  ];

  const timeSeriesData = [
    ...historical.map((h) => ({ year: h.year, actual: h.actual })),
    ...forecastYears.map((f, idx) => {
      const band = 6_500 + idx * 900;
      return {
        year: f.year,
        forecast: f.forecast,
        lowerBound: Math.max(0, f.forecast - band),
        upperBound: f.forecast + band,
      };
    }),
  ];

  const yearlyBreakdown = forecastYears.map((f, idx) => {
    const band = 6_500 + idx * 900;
    return {
      year: f.year,
      forecast: f.forecast,
      lowerBound: Math.max(0, f.forecast - band),
      upperBound: f.forecast + band,
      growth: f.growth,
    };
  });

  return {
    totalProjection: forecastYears.reduce((sum, y) => sum + y.forecast, 0),
    annualGrowth: 4.6,
    rmse: 3.12,
    mae: 2.48,
    confidence: 95,
    timeSeriesData,
    yearlyBreakdown,
  };
}

export type District = { id: string; name: string };

export function getMockDistricts(): { districts: District[] } {
  return {
    districts: [
      { id: 'a', name: 'District A' },
      { id: 'b', name: 'District B' },
      { id: 'c', name: 'District C' },
      { id: 'd', name: 'District D' },
      { id: 'e', name: 'District E' },
      { id: 'f', name: 'District F' },
    ],
  };
}

export type DistrictAnalysis = {
  compositeScore: number;
  rank: number;
  correlation: number;
  riskCategory: string;
  indicators: Array<{ name: string; value: number }>;
  scatterData: Array<{ imbalance: number; migration: number }>;
};

export function getMockDistrictAnalysis(districtName: string): DistrictAnalysis {
  const seed = (districtName || 'District').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const base = 0.55 + ((seed % 35) / 100); // 0.55 - 0.89
  const compositeScore = Math.min(0.93, Math.max(0.18, base));
  const rank = Math.max(1, Math.round((1 - compositeScore) * 240));
  const correlation = 0.62 + ((seed % 18) / 100); // 0.62 - 0.79

  const riskCategory = compositeScore >= 0.8 ? 'High' : compositeScore >= 0.65 ? 'Medium' : 'Low';

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  const indicators = [
    { name: 'Economic Dependency', value: clamp01(compositeScore * 0.95) },
    { name: 'Infrastructure Score', value: clamp01(1 - compositeScore * 0.55) },
    { name: 'Healthcare Access', value: clamp01(1 - compositeScore * 0.48) },
    { name: 'Education Quality', value: clamp01(1 - compositeScore * 0.44) },
    { name: 'Night-Light Intensity', value: clamp01(1 - compositeScore * 0.52) },
  ];

  const scatterData = Array.from({ length: 22 }).map((_, idx) => {
    const imbalance = clamp01(0.25 + idx * 0.03 + ((seed % 7) / 100));
    const migration = 6 + imbalance * 14 + ((idx % 5) - 2) * 0.5;
    return { imbalance, migration: Math.max(1, Math.round(migration * 10) / 10) };
  });

  return {
    compositeScore,
    rank,
    correlation,
    riskCategory: `${riskCategory} Risk`,
    indicators,
    scatterData,
  };
}

export type FeedbackRecord = {
  district: string;
  policyName: string;
  status: 'proposed' | 'approved' | 'implemented' | 'rejected';
  budget: string;
  outcomes?: string;
  createdAt?: string;
};

export function getMockFeedback(): { feedback: FeedbackRecord[] } {
  const now = Date.now();
  const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

  return {
    feedback: [
      {
        district: 'District A',
        policyName: 'Rural Job Acceleration Program 2026',
        status: 'implemented',
        budget: '65000000',
        outcomes: 'Early signs of reduced out-migration in 3 blocks; wage participation up 7%.',
        createdAt: daysAgo(14),
      },
      {
        district: 'District B',
        policyName: 'Primary Healthcare Upgrade Phase 1',
        status: 'approved',
        budget: '42000000',
        outcomes: 'Procurement completed; facility upgrades scheduled for next quarter.',
        createdAt: daysAgo(22),
      },
      {
        district: 'District D',
        policyName: 'District Roads & Market Access',
        status: 'implemented',
        budget: '98000000',
        outcomes: 'Travel time to mandi reduced ~18%; small business registrations trending up.',
        createdAt: daysAgo(41),
      },
      {
        district: 'District C',
        policyName: 'Secondary School Retention Initiative',
        status: 'proposed',
        budget: '15000000',
        outcomes: 'Stakeholder consultation in progress; pilot sites shortlisted.',
        createdAt: daysAgo(9),
      },
      {
        district: 'District E',
        policyName: 'Water & Sanitation Reliability',
        status: 'rejected',
        budget: '30000000',
        outcomes: 'Rejected due to overlap with an existing centrally funded scheme.',
        createdAt: daysAgo(60),
      },
    ],
  };
}

export type SimulationResult = {
  baseline: number;
  projected: number;
  reduction: number;
  confidence: number;
  bestCase: number;
  worstCase: number;
  timeSeriesComparison: Array<{ year: string; baseline: number; projected: number }>;
  budgetBreakdown: Array<{ category: string; amount: number }>;
};

export function getMockSimulationResult(params: {
  district: string;
  budget: number;
  levers: { jobs: number; healthcare: number; education: number; infrastructure: number };
}): SimulationResult {
  const { budget, levers } = params;

  const baseline = 520_000;

  const jobsImpact = levers.jobs * 0.14;
  const healthcareImpact = levers.healthcare * 0.08;
  const educationImpact = levers.education * 0.07;
  const infraImpact = levers.infrastructure * 0.05;

  const rawReduction = (jobsImpact + healthcareImpact + educationImpact + infraImpact) / 100;
  const reduction = Math.max(4, Math.min(18, rawReduction * 100));

  const projected = Math.round(baseline * (1 - reduction / 100));

  const years = ['2026', '2027', '2028', '2029', '2030', '2031'];
  const timeSeriesComparison = years.map((year, idx) => {
    const baselineYear = Math.round((baseline / years.length) * (0.9 + idx * 0.04));
    const projectedYear = Math.round(baselineYear * (1 - reduction / 100) * (0.98 + idx * 0.01));
    return { year, baseline: baselineYear, projected: projectedYear };
  });

  const budgetBreakdown = [
    { category: 'Job Creation Programs', amount: Math.round((budget * levers.jobs) / 100) },
    { category: 'Healthcare Infrastructure', amount: Math.round((budget * levers.healthcare) / 100) },
    { category: 'Education Quality', amount: Math.round((budget * levers.education) / 100) },
    { category: 'Physical Infrastructure', amount: Math.round((budget * levers.infrastructure) / 100) },
  ];

  return {
    baseline,
    projected,
    reduction,
    confidence: 86,
    bestCase: Math.min(22, reduction + 4.5),
    worstCase: Math.max(1.5, reduction - 4.2),
    timeSeriesComparison,
    budgetBreakdown,
  };
}
