import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertCircle, Info, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function ImbalanceEngine() {
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtData, setDistrictData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-13260aab/imbalance/districts`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch districts');
      
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch (err: any) {
      console.error('Fetch districts error:', err);
      setError(err.message);
    }
  };

  const analyzeDistrict = async () => {
    if (!selectedDistrict) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-13260aab/imbalance/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ district: selectedDistrict }),
        }
      );

      if (!response.ok) throw new Error('Failed to analyze district');

      const data = await response.json();
      setDistrictData(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Imbalance Engine</h2>
        <p className="text-muted-foreground mt-1">
          Compute composite scores from economic, infrastructure, and social indicators
        </p>
      </div>

      {/* Selection */}
      <Card>
        <CardHeader>
          <CardTitle>District Selection</CardTitle>
          <CardDescription>
            Select a district to analyze imbalance scores and component indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.name}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={analyzeDistrict} disabled={!selectedDistrict || loading}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {districtData && (
        <>
          {/* Composite Score */}
          <Card>
            <CardHeader>
              <CardTitle>Composite Imbalance Score</CardTitle>
              <CardDescription>
                Normalized score (0-1) combining economic dependency, infrastructure, and social indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-6xl font-bold text-foreground">
                  {districtData.compositeScore?.toFixed(3)}
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-destructive transition-all duration-500"
                      style={{ width: `${(districtData.compositeScore || 0) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Low Risk</span>
                    <span>High Risk</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">National Rank</div>
                  <div className="text-2xl font-bold text-foreground mt-1">
                    #{districtData.rank || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">of 247 districts</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Correlation (r)</div>
                  <div className="text-2xl font-bold text-foreground mt-1">
                    {districtData.correlation?.toFixed(2) || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">with migration (p {'<'} 0.05)</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Risk Category</div>
                  <div className="text-2xl font-bold text-destructive mt-1">
                    {districtData.riskCategory || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">intervention priority</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Component Indicators</CardTitle>
              <CardDescription>
                Normalized sub-scores (0-1) contributing to composite imbalance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={districtData.indicators || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" domain={[0, 1]} stroke="#64748B" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={12} width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Economic Dependency:</strong> Ratio of unemployed to employed population, normalized across districts
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Infrastructure Score:</strong> Composite of healthcare facilities, schools, and night-light intensity
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Normalization Method:</strong> Min-Max scaling applied to ensure comparability across indicators
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scatter Plot: Imbalance vs Migration */}
          <Card>
            <CardHeader>
              <CardTitle>Imbalance vs. Migration Correlation</CardTitle>
              <CardDescription>
                Scatter plot demonstrating relationship between composite score and historical migration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    type="number"
                    dataKey="imbalance"
                    name="Imbalance Score"
                    stroke="#64748B"
                    fontSize={12}
                    label={{ value: 'Imbalance Score', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="migration"
                    name="Migration Rate"
                    stroke="#64748B"
                    fontSize={12}
                    label={{ value: 'Migration Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Scatter name="Districts" data={districtData.scatterData || []} fill="#8B5CF6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Methodology */}
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Methodology & Transparency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Data Sources:</strong> Migration XLS (2015-2025), Health Infrastructure XLS, 
            Schools CSV, VIIRS Night-Light GeoTIFF
          </p>
          <p>
            <strong className="text-foreground">Normalization:</strong> All indicators scaled to [0,1] using min-max normalization 
            to ensure comparability
          </p>
          <p>
            <strong className="text-foreground">Weighting:</strong> Economic Dependency (40%), Infrastructure (35%), Social Indicators (25%)
          </p>
          <p>
            <strong className="text-foreground">Validation:</strong> Pearson correlation with historical migration (r ≥ 0.6, p {'<'} 0.05)
          </p>
          <p>
            <strong className="text-foreground">Audit Trail:</strong> All computations logged with timestamps for governance review
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
