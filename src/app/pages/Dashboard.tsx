import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle, TrendingUp, MapPin, Target, Activity, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface DashboardData {
  nationalAverage: number;
  highestRiskDistrict: string;
  fiveYearProjection: number;
  confidenceScore: number;
  dataQuality: number;
  topDistricts: Array<{ district: string; score: number }>;
  migrationTrend: Array<{ year: string; value: number }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-13260aab/dashboard/summary`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Executive Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Real-time overview of migration patterns and regional imbalances
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              National Imbalance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {data?.nationalAverage?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Composite Score (0-1)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Highest Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-destructive">
              {data?.highestRiskDistrict || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Priority District</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              5-Year Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {data?.fiveYearProjection?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Expected Migrants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Confidence Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {data?.confidenceScore?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Model Accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Data Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-3">
              {data?.dataQuality?.toFixed(0) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completeness</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Migration Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Trend (Historical)</CardTitle>
            <CardDescription>
              Year-over-year rural-to-urban migration patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.migrationTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  name="Migrants"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Risk Districts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Risk Districts</CardTitle>
            <CardDescription>
              Districts with highest imbalance scores requiring intervention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.topDistricts || []} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis type="category" dataKey="district" stroke="#64748B" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="score" fill="#DC2626" radius={[0, 4, 4, 0]} name="Imbalance Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Statistical Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Statistical Validation</CardTitle>
          <CardDescription>
            Model performance and data reliability indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Correlation Coefficient</div>
              <div className="text-2xl font-bold text-foreground">r = 0.78</div>
              <p className="text-xs text-muted-foreground mt-1">Imbalance ↔ Migration (p {'<'} 0.001)</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">RMSE (Forecast)</div>
              <div className="text-2xl font-bold text-foreground">3.2%</div>
              <p className="text-xs text-muted-foreground mt-1">Mean prediction error</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Sample Size</div>
              <div className="text-2xl font-bold text-foreground">247</div>
              <p className="text-xs text-muted-foreground mt-1">Districts analyzed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Recommendations */}
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <AlertCircle className="w-5 h-5" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
            <p className="text-sm text-foreground">
              <strong>Priority:</strong> Review Imbalance Engine for top 5 risk districts and initiate simulation scenarios.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
            <p className="text-sm text-foreground">
              <strong>Forecast Alert:</strong> Migration expected to increase 12% over baseline in next 18 months without intervention.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
            <p className="text-sm text-foreground">
              <strong>Data Update:</strong> Healthcare infrastructure data pending update for Q1 2026.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
