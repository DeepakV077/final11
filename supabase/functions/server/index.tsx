import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client for auth
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Health check endpoint
app.get("/make-server-13260aab/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

app.post("/make-server-13260aab/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create user with service role
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: role || 'analyst' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ error: error.message || 'Signup failed' }, 500);
  }
});

// ============================================
// DASHBOARD ENDPOINTS
// ============================================

app.get("/make-server-13260aab/dashboard/summary", async (c) => {
  try {
    // Mock data - would fetch from real data sources in production
    const summary = {
      nationalAverage: 0.68,
      highestRiskDistrict: 'District A',
      fiveYearProjection: 345600,
      confidenceScore: 87.3,
      dataQuality: 94.2,
      topDistricts: [
        { district: 'District A', score: 0.84 },
        { district: 'District B', score: 0.79 },
        { district: 'District C', score: 0.75 },
        { district: 'District D', score: 0.71 },
        { district: 'District E', score: 0.68 },
      ],
      migrationTrend: [
        { year: '2020', value: 52000 },
        { year: '2021', value: 56800 },
        { year: '2022', value: 61200 },
        { year: '2023', value: 65700 },
        { year: '2024', value: 68900 },
        { year: '2025', value: 72400 },
      ],
    };

    return c.json(summary);
  } catch (error: any) {
    console.error('Dashboard summary error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// IMBALANCE ENGINE ENDPOINTS
// ============================================

app.get("/make-server-13260aab/imbalance/districts", async (c) => {
  try {
    const districts = [
      { id: 1, name: 'District A' },
      { id: 2, name: 'District B' },
      { id: 3, name: 'District C' },
      { id: 4, name: 'District D' },
      { id: 5, name: 'District E' },
    ];

    return c.json({ districts });
  } catch (error: any) {
    console.error('Fetch districts error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-13260aab/imbalance/analyze", async (c) => {
  try {
    const { district } = await c.req.json();

    // Mock analysis data
    const analysis = {
      district,
      compositeScore: 0.742,
      rank: 12,
      correlation: 0.78,
      riskCategory: 'High',
      indicators: [
        { name: 'Economic Dependency', value: 0.82 },
        { name: 'Healthcare Access', value: 0.68 },
        { name: 'Education Quality', value: 0.71 },
        { name: 'Infrastructure Score', value: 0.79 },
        { name: 'Night Light Intensity', value: 0.64 },
      ],
      scatterData: Array.from({ length: 50 }, (_, i) => ({
        imbalance: 0.3 + Math.random() * 0.6,
        migration: 5 + Math.random() * 15,
      })),
    };

    return c.json(analysis);
  } catch (error: any) {
    console.error('Imbalance analysis error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// FORECAST ENGINE ENDPOINTS
// ============================================

app.get("/make-server-13260aab/forecast/baseline", async (c) => {
  try {
    const forecast = {
      totalProjection: 345600,
      annualGrowth: 8.2,
      rmse: 3.21,
      mae: 2.87,
      aic: 842.3,
      confidence: 95,
      timeSeriesData: [
        { year: '2020', actual: 52000, forecast: null, lowerBound: null, upperBound: null },
        { year: '2021', actual: 56800, forecast: null, lowerBound: null, upperBound: null },
        { year: '2022', actual: 61200, forecast: null, lowerBound: null, upperBound: null },
        { year: '2023', actual: 65700, forecast: null, lowerBound: null, upperBound: null },
        { year: '2024', actual: 68900, forecast: null, lowerBound: null, upperBound: null },
        { year: '2025', actual: 72400, forecast: null, lowerBound: null, upperBound: null },
        { year: '2026', actual: null, forecast: 75800, lowerBound: 71200, upperBound: 80400 },
        { year: '2027', actual: null, forecast: 79400, lowerBound: 73900, upperBound: 84900 },
        { year: '2028', actual: null, forecast: 83200, lowerBound: 76800, upperBound: 89600 },
        { year: '2029', actual: null, forecast: 87300, lowerBound: 79900, upperBound: 94700 },
        { year: '2030', actual: null, forecast: 91600, lowerBound: 83200, upperBound: 100000 },
        { year: '2031', actual: null, forecast: 96200, lowerBound: 86800, upperBound: 105600 },
      ],
      yearlyBreakdown: [
        { year: '2026', forecast: 75800, lowerBound: 71200, upperBound: 80400, growth: 4.7 },
        { year: '2027', forecast: 79400, lowerBound: 73900, upperBound: 84900, growth: 4.8 },
        { year: '2028', forecast: 83200, lowerBound: 76800, upperBound: 89600, growth: 4.8 },
        { year: '2029', forecast: 87300, lowerBound: 79900, upperBound: 94700, growth: 4.9 },
        { year: '2030', forecast: 91600, lowerBound: 83200, upperBound: 100000, growth: 4.9 },
        { year: '2031', forecast: 96200, lowerBound: 86800, upperBound: 105600, growth: 5.0 },
      ],
    };

    return c.json(forecast);
  } catch (error: any) {
    console.error('Forecast baseline error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// SIMULATION ENDPOINTS
// ============================================

app.post("/make-server-13260aab/simulation/run", async (c) => {
  try {
    const { district, budget, levers } = await c.req.json();

    // Simulate impact calculation based on lever allocation
    const jobsImpact = (levers.jobs / 100) * 0.25; // 25% max impact for jobs
    const healthcareImpact = (levers.healthcare / 100) * 0.15;
    const educationImpact = (levers.education / 100) * 0.12;
    const infrastructureImpact = (levers.infrastructure / 100) * 0.10;
    const totalReduction = (jobsImpact + healthcareImpact + educationImpact + infrastructureImpact) * 100;

    const baseline = 68750;
    const projected = Math.round(baseline * (1 - totalReduction / 100));

    const result = {
      district,
      baseline,
      projected,
      reduction: totalReduction,
      confidence: 85 + Math.random() * 10,
      bestCase: totalReduction + 5,
      worstCase: totalReduction - 3,
      timeSeriesComparison: [
        { year: '2026', baseline: 12500, projected: 11800 },
        { year: '2027', baseline: 13100, projected: 12200 },
        { year: '2028', baseline: 13750, projected: 12650 },
        { year: '2029', baseline: 14400, projected: 13100 },
        { year: '2030', baseline: 15000, projected: 13550 },
      ],
      budgetBreakdown: [
        { category: 'Job Creation', amount: budget * (levers.jobs / 100) },
        { category: 'Healthcare', amount: budget * (levers.healthcare / 100) },
        { category: 'Education', amount: budget * (levers.education / 100) },
        { category: 'Infrastructure', amount: budget * (levers.infrastructure / 100) },
      ],
    };

    return c.json(result);
  } catch (error: any) {
    console.error('Simulation run error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// FEEDBACK ENDPOINTS
// ============================================

app.get("/make-server-13260aab/feedback", async (c) => {
  try {
    const feedbackData = await kv.getByPrefix('feedback:');
    return c.json({ feedback: feedbackData || [] });
  } catch (error: any) {
    console.error('Fetch feedback error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-13260aab/feedback", async (c) => {
  try {
    const feedbackData = await c.req.json();
    const id = `feedback:${Date.now()}`;
    
    await kv.set(id, {
      ...feedbackData,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, id });
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// AI CHAT ENDPOINT
// ============================================

app.post("/make-server-13260aab/chat", async (c) => {
  try {
    const { message, history } = await c.req.json();

    // Rule-based response generation (could be enhanced with OpenAI API)
    let response = '';

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('imbalance') || lowerMessage.includes('score')) {
      response = `The imbalance score is a composite metric (0-1) that combines:

• **Economic Dependency** (40%): Ratio of unemployed to employed population
• **Infrastructure** (35%): Healthcare facilities, schools, night-light intensity
• **Social Indicators** (25%): Education quality, health access

Higher scores indicate greater regional imbalance and higher migration risk. Scores above 0.7 are considered "High Risk" and warrant immediate policy intervention.`;
    } else if (lowerMessage.includes('forecast') || lowerMessage.includes('arima') || lowerMessage.includes('projection')) {
      response = `The forecast engine uses **ARIMA (Auto-Regressive Integrated Moving Average)** models to project migration trends:

• Trained on 2015-2025 historical data (120 months)
• 95% confidence intervals computed from forecast standard errors
• RMSE ~3.2% indicates strong predictive accuracy
• Walk-forward cross-validation prevents overfitting

The baseline forecast assumes **no policy interventions**. Use the Simulation Wizard to model intervention scenarios.`;
    } else if (lowerMessage.includes('simulation') || lowerMessage.includes('lever') || lowerMessage.includes('policy')) {
      response = `The Simulation Wizard models multi-lever interventions:

• **Job Creation** (highest ROI): Each 10% allocation reduces migration by ~2-3%
• **Healthcare**: Moderate impact on push factors
• **Education**: Long-term retention benefits
• **Infrastructure**: Improves quality of life indicators

**Recommended Starting Point:**
- Jobs: 40%
- Healthcare: 25%
- Education: 20%
- Infrastructure: 15%

Adjust based on district-specific needs and historical intervention data.`;
    } else if (lowerMessage.includes('confidence') || lowerMessage.includes('rmse') || lowerMessage.includes('validation')) {
      response = `Statistical validation metrics ensure model reliability:

• **RMSE (Root Mean Square Error)**: Average prediction error magnitude (~3.2%)
• **Correlation (r)**: Imbalance score ↔ migration (r = 0.78, p < 0.001)
• **Confidence Intervals**: 95% CI computed assuming normal distribution
• **AIC (Akaike Information Criterion)**: Balances model fit vs. complexity

Lower RMSE and higher correlation indicate more reliable forecasts. All metrics meet institutional standards for policy-grade analytics.`;
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('brief') || lowerMessage.includes('justification')) {
      response = `The Budget Brief Generator creates audit-ready policy justifications:

**Included Sections:**
- Executive summary with key findings
- Baseline assessment (current imbalance & migration)
- Proposed intervention with budget breakdown
- Projected outcomes with confidence levels
- Statistical validation (ARIMA, correlation, RMSE)
- Policy recommendations

Export as PDF for presentation to State Planning Commissions, Ministry of Rural Development, or Urban Infrastructure Boards.`;
    } else if (lowerMessage.includes('data') || lowerMessage.includes('source') || lowerMessage.includes('quality')) {
      response = `CitySpark integrates multiple authoritative data sources:

• **Migration Data**: State-level XLS (2015-2025)
• **Health Infrastructure**: Ministry XLS (facilities, beds, doctors)
• **Education**: Schools CSV (enrollment, quality metrics)
• **Night-Light Intensity**: VIIRS GeoTIFF (proxy for economic activity)
• **District Shapefiles**: Geographic boundaries

All data undergoes cleaning, normalization (min-max scaling), and validation. Data quality score of 94%+ ensures audit-ready analytics.`;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      response = `I can help you with:

🔍 **Explain** imbalance scores and rankings
📈 **Interpret** forecast trends and confidence intervals
💡 **Suggest** simulation scenarios and optimal lever allocations
📄 **Draft** policy justification text for budget briefs
📊 **Clarify** statistical metrics (RMSE, correlation, AIC)
🎯 **Recommend** intervention priorities based on risk levels

What would you like to know more about?`;
    } else {
      response = `I'm your CitySpark Policy Assistant. I can help explain:

• Imbalance scores and methodology
• Forecast trends and ARIMA models
• Simulation scenarios and policy levers
• Statistical validation metrics
• Budget brief generation

Could you rephrase your question, or ask about one of these topics?`;
    }

    return c.json({ response });
  } catch (error: any) {
    console.error('Chat error:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);