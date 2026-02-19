import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertCircle, TrendingUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function ForecastEngine() {
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-13260aab/forecast/baseline`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch forecast data');

      const data = await response.json();
      setForecastData(data);
    } catch (err: any) {
      console.error('Forecast fetch error:', err);
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
          <p className="text-muted-foreground">Generating ARIMA forecast...</p>
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
      <div>
        <h2 className="text-2xl font-bold text-foreground">Forecast Engine</h2>
        <p className="text-muted-foreground mt-1">
          ARIMA-based migration projections with confidence intervals and statistical validation
        </p>
      </div>

      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">5-Year Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {forecastData?.totalProjection?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Expected migrants (2026-2031)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Annual Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              +{forecastData?.annualGrowth?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Year-over-year increase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">RMSE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {forecastData?.rmse?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Root Mean Square Error</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {forecastData?.confidence?.toFixed(0) || '95'}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Statistical confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Historical + Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Data & 5-Year Baseline Projection</CardTitle>
          <CardDescription>
            ARIMA(p,d,q) model trained on 2015-2025 data with 95% confidence intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={forecastData?.timeSeriesData || []}>
              <defs>
                <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
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
              <Legend />
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="url(#colorUpper)"
                fillOpacity={1}
                name="Upper 95% CI"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="none"
                fill="url(#colorLower)"
                fillOpacity={1}
                name="Lower 95% CI"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
                name="Historical"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#DC2626"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#DC2626', r: 4 }}
                name="Forecast"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Model Type:</strong> ARIMA (Auto-Regressive Integrated Moving Average) | 
              <strong className="text-foreground ml-3">Training Period:</strong> 2015-2025 (120 months) | 
              <strong className="text-foreground ml-3">Validation:</strong> Walk-forward cross-validation
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Year-by-Year Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Year-by-Year Projection Details</CardTitle>
          <CardDescription>
            Annual migration forecasts with confidence bounds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Year</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Forecast</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Lower CI (95%)</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Upper CI (95%)</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Growth</th>
                </tr>
              </thead>
              <tbody>
                {(forecastData?.yearlyBreakdown || []).map((row: any, idx: number) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/20">
                    <td className="py-3 px-4 text-foreground font-medium">{row.year}</td>
                    <td className="text-right py-3 px-4 text-foreground">{row.forecast?.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">{row.lowerBound?.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">{row.upperBound?.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-destructive">+{row.growth?.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Model Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Model Validation & Performance</CardTitle>
          <CardDescription>
            Statistical metrics ensuring forecast reliability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">RMSE (Root Mean Square Error)</div>
              <div className="text-2xl font-bold text-foreground">{forecastData?.rmse?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">Average prediction error magnitude</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">MAE (Mean Absolute Error)</div>
              <div className="text-2xl font-bold text-foreground">{forecastData?.mae?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">Average absolute deviation</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">AIC (Akaike Information Criterion)</div>
              <div className="text-2xl font-bold text-foreground">{forecastData?.aic?.toFixed(1) || '0.0'}</div>
              <p className="text-xs text-muted-foreground mt-1">Model fit vs complexity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Forecast Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p>
              <strong className="text-foreground">Model Selection:</strong> Auto-ARIMA with automated parameter selection 
              (p, d, q) based on AIC minimization
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p>
              <strong className="text-foreground">Stationarity Testing:</strong> Augmented Dickey-Fuller test applied; 
              differencing (d) selected to ensure stationarity
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p>
              <strong className="text-foreground">Confidence Intervals:</strong> 95% CI computed from forecast standard errors 
              assuming normal distribution
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p>
              <strong className="text-foreground">Validation:</strong> Walk-forward cross-validation on held-out 2024-2025 data 
              to prevent overfitting
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p>
              <strong className="text-foreground">Limitations:</strong> Assumes no structural breaks or policy interventions. 
              Use Simulation Engine to model intervention scenarios.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
