import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Lightbulb, 
  FileText, 
  Users, 
  Building2,
  Target,
  Brain,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CitySpark</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            Enterprise GovTech Intelligence Platform
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Reduce Rural-to-Urban Migration
            <br />
            <span className="text-primary">By 15% Over Five Years</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            CitySpark empowers policymakers with advanced analytics, forecast modeling, 
            and AI-assisted policy simulation to address regional imbalances and create 
            evidence-based intervention strategies.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="h-12 px-8">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="h-12 px-8">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Urban-Rural Imbalance Crisis
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unplanned urbanization strains infrastructure, while rural regions face declining 
              economic opportunities and quality of life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Growing Migration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Rural-to-urban migration increases by 8-12% annually in developing regions, 
                overwhelming city services and infrastructure.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Regional Inequality</h3>
              <p className="text-muted-foreground leading-relaxed">
                Economic dependency scores reveal stark imbalances in employment, healthcare, 
                education, and infrastructure access.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Limited Intelligence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Policymakers lack integrated tools to forecast migration trends and simulate 
                the impact of multi-lever interventions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Modules */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comprehensive Intelligence Modules
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six integrated engines deliver end-to-end analytics from data collection 
              to policy justification.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'Imbalance Engine',
                description: 'Compute composite scores from economic, infrastructure, and social indicators with transparent normalization.',
              },
              {
                icon: TrendingUp,
                title: 'Forecast Engine',
                description: 'ARIMA-based migration projections with confidence intervals and statistical validation (RMSE).',
              },
              {
                icon: Lightbulb,
                title: 'Simulation Wizard',
                description: 'Model policy impacts across multiple levers: jobs, healthcare, education, infrastructure, and budget.',
              },
              {
                icon: FileText,
                title: 'Budget Brief Generator',
                description: 'Auto-generate audit-ready justifications with executive summaries and statistical evidence.',
              },
              {
                icon: CheckCircle2,
                title: 'Feedback Tracking',
                description: 'Monitor policy adoption rates, allocated budgets, and real-world outcomes.',
              },
              {
                icon: Brain,
                title: 'AI Policy Assistant',
                description: 'Natural language interface to explain results, interpret trends, and draft recommendations.',
              },
            ].map((module, idx) => (
              <div key={idx} className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <module.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">{module.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How CitySpark Works
            </h2>
            <p className="text-lg text-muted-foreground">
              A systematic, evidence-based approach to policy intelligence
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Data Ingestion & Normalization',
                description: 'Import migration data, infrastructure indicators, and socioeconomic metrics. Automated cleaning and standardization ensure audit-ready quality.',
              },
              {
                step: '02',
                title: 'Imbalance Scoring & Ranking',
                description: 'Compute composite scores using weighted indicators. Identify highest-risk districts with statistical significance (p < 0.05).',
              },
              {
                step: '03',
                title: 'Baseline Forecast Projection',
                description: 'Generate 5-year migration trends using ARIMA models. Visualize confidence bands and validation metrics.',
              },
              {
                step: '04',
                title: 'Multi-Lever Policy Simulation',
                description: 'Model interventions across jobs, healthcare, education, and infrastructure. Compare baseline vs. projected outcomes.',
              },
              {
                step: '05',
                title: 'Budget Justification & Deployment',
                description: 'Export PDF briefs with executive summaries, statistical validation, and recommended allocations for presentation to planning commissions.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trusted by Government Institutions
            </h2>
            <p className="text-lg text-muted-foreground">
              Enterprise-grade platform designed for national deployment
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '15%', label: 'Target Migration Reduction' },
              { value: '5 Year', label: 'Forecast Horizon' },
              { value: '99.9%', label: 'Data Accuracy' },
              { value: 'SOC-2', label: 'Compliance Ready' },
            ].map((metric, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Regional Policy?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join state planning commissions and urban development boards using CitySpark 
            to make evidence-based decisions.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/signup')}
              className="h-12 px-8"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="h-12 px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-primary" />
                <span className="font-bold text-foreground">CitySpark</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enterprise GovTech intelligence platform for evidence-based policy decisions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 CitySpark. All rights reserved. Built for institutional deployment.
          </div>
        </div>
      </footer>
    </div>
  );
}
