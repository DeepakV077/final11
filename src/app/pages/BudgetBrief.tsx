import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { FileText, Download, CheckCircle2 } from 'lucide-react';

export default function BudgetBrief() {
  const [district, setDistrict] = useState('');
  const [simulationId, setSimulationId] = useState('');
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateBrief = async () => {
    if (!district || !simulationId) return;

    setLoading(true);

    // Simulate brief generation (would call backend in production)
    setTimeout(() => {
      setBrief({
        title: `Policy Intervention Brief: ${district}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        executiveSummary: `This brief presents evidence-based policy recommendations to reduce rural-to-urban migration in ${district} by 15% over five years through multi-lever interventions.`,
        baselineData: {
          currentMigrationRate: '12,500 people/year',
          imbalanceScore: '0.742 (High Risk)',
          fiveYearProjection: '68,750 migrants (baseline)',
        },
        proposedIntervention: {
          totalBudget: '₹50,000,000 (50M INR)',
          levers: [
            { name: 'Job Creation Programs', allocation: '₹20,000,000 (40%)', impact: '6-8% reduction' },
            { name: 'Healthcare Infrastructure', allocation: '₹12,500,000 (25%)', impact: '2-3% reduction' },
            { name: 'Education Quality', allocation: '₹10,000,000 (20%)', impact: '2-3% reduction' },
            { name: 'Physical Infrastructure', allocation: '₹7,500,000 (15%)', impact: '1-2% reduction' },
          ],
        },
        projectedOutcome: {
          migrationReduction: '15.2%',
          peopleRetained: '10,450 over 5 years',
          confidenceLevel: '87%',
        },
        statisticalValidation: {
          arimaForecast: 'RMSE: 3.2%, AIC: 842.3',
          correlationStrength: 'r = 0.78 (p < 0.001)',
          historicalComparison: '50+ interventions analyzed (2010-2025)',
        },
        recommendations: [
          'Prioritize job creation programs with proven ROI (40% budget allocation)',
          'Focus healthcare investments on primary care facilities and mobile clinics',
          'Implement skill development programs aligned with local industry needs',
          'Establish quarterly monitoring framework to track outcomes',
          'Conduct mid-term evaluation after 2.5 years to adjust strategy',
        ],
      });
      setLoading(false);
    }, 1500);
  };

  const exportPDF = () => {
    alert('PDF export functionality would trigger here in production.');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Budget Brief Generator</h2>
        <p className="text-muted-foreground mt-1">
          Auto-generate audit-ready justifications with executive summaries and statistical evidence
        </p>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Brief Configuration</CardTitle>
          <CardDescription>
            Select district and simulation to generate comprehensive policy brief
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target District</label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="District A">District A (High Risk)</SelectItem>
                  <SelectItem value="District B">District B (Medium Risk)</SelectItem>
                  <SelectItem value="District C">District C (Low Risk)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Simulation Scenario</label>
              <Select value={simulationId} onValueChange={setSimulationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select simulation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim-1">Simulation #1 (15.2% reduction)</SelectItem>
                  <SelectItem value="sim-2">Simulation #2 (12.8% reduction)</SelectItem>
                  <SelectItem value="sim-3">Simulation #3 (18.5% reduction)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={generateBrief} disabled={!district || !simulationId || loading} className="w-full">
            {loading ? 'Generating Brief...' : 'Generate Policy Brief'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Brief */}
      {brief && (
        <>
          {/* Brief Header */}
          <Card className="border-2 border-primary">
            <CardHeader className="bg-primary/5">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{brief.title}</CardTitle>
                  <CardDescription className="mt-2">
                    Generated: {brief.date} | CitySpark Intelligence Platform
                  </CardDescription>
                </div>
                <Button onClick={exportPDF} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{brief.executiveSummary}</p>
            </CardContent>
          </Card>

          {/* Baseline Data */}
          <Card>
            <CardHeader>
              <CardTitle>Current Baseline Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Current Migration Rate</div>
                  <div className="text-xl font-bold text-foreground">{brief.baselineData.currentMigrationRate}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Imbalance Score</div>
                  <div className="text-xl font-bold text-destructive">{brief.baselineData.imbalanceScore}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">5-Year Projection (Baseline)</div>
                  <div className="text-xl font-bold text-foreground">{brief.baselineData.fiveYearProjection}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposed Intervention */}
          <Card>
            <CardHeader>
              <CardTitle>Proposed Multi-Lever Intervention</CardTitle>
              <CardDescription>Budget allocation and expected impact by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-accent/10 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Budget Allocation</div>
                <div className="text-3xl font-bold text-accent">{brief.proposedIntervention.totalBudget}</div>
              </div>

              <div className="space-y-4">
                {brief.proposedIntervention.levers.map((lever: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <div className="font-semibold text-foreground">{lever.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">Expected Impact: {lever.impact}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{lever.allocation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projected Outcome */}
          <Card className="border-chart-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-chart-3">
                <CheckCircle2 className="w-5 h-5" />
                Projected Outcome
              </CardTitle>
              <CardDescription>Expected impact over 5-year intervention period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Migration Reduction</div>
                  <div className="text-4xl font-bold text-chart-3">{brief.projectedOutcome.migrationReduction}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">People Retained</div>
                  <div className="text-4xl font-bold text-foreground">{brief.projectedOutcome.peopleRetained}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Confidence Level</div>
                  <div className="text-4xl font-bold text-accent">{brief.projectedOutcome.confidenceLevel}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistical Validation */}
          <Card>
            <CardHeader>
              <CardTitle>Statistical Validation</CardTitle>
              <CardDescription>Model performance and evidence base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">ARIMA Forecast Quality</span>
                <span className="font-semibold text-foreground">{brief.statisticalValidation.arimaForecast}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Correlation Strength</span>
                <span className="font-semibold text-foreground">{brief.statisticalValidation.correlationStrength}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Historical Evidence Base</span>
                <span className="font-semibold text-foreground">{brief.statisticalValidation.historicalComparison}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Recommendations</CardTitle>
              <CardDescription>Actionable next steps for implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {brief.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-foreground pt-0.5">{rec}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="text-xs text-muted-foreground space-y-2">
                <p>
                  <strong className="text-foreground">Prepared by:</strong> CitySpark Intelligence Platform | Enterprise GovTech Analytics
                </p>
                <p>
                  <strong className="text-foreground">Audit Trail:</strong> All data sources, computations, and model parameters 
                  logged for governance review (ID: {simulationId})
                </p>
                <p>
                  <strong className="text-foreground">Disclaimer:</strong> Projections based on historical data and statistical models. 
                  Actual outcomes subject to implementation quality and external factors.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
