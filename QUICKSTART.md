# CitySpark - Quick Start Guide

## 🚀 Getting Started

### 1. Create Your First User

Navigate to the **Signup page** (`/signup`):

1. Enter your details:
   - **Full Name**: e.g., "Dr. Sarah Johnson"
   - **Email**: e.g., "sarah.johnson@cityspark.gov"
   - **Role**: Select "Policy Analyst" (or Admin for full access)
   - **Password**: Minimum 6 characters
   - **Confirm Password**: Match your password

2. Click **"Create Account"**

3. You'll be redirected to the login page with a success message

### 2. Sign In

Navigate to **Login** (`/login`):

1. Enter your email and password
2. Click **"Sign In"**
3. You'll be redirected to the **Dashboard** (`/dashboard`)

### 3. Explore the Platform

Once logged in, you'll see the protected dashboard layout with:

#### Sidebar Navigation (Left)
- 📊 **Dashboard** - Executive overview
- 📈 **Imbalance Engine** - Regional analysis
- 📉 **Forecast Engine** - ARIMA projections
- 💡 **Simulation Wizard** - Policy modeling
- 📄 **Budget Brief** - Justification generator
- 💬 **Feedback Tracking** - Outcome monitoring

#### Top Header
- Current page title
- Your user profile (name + role)

#### Floating Chatbot (Bottom Right)
- Click the blue chat button to open the AI assistant
- Ask questions about:
  - Imbalance scores
  - Forecast methodology
  - Simulation recommendations
  - Statistical validation

---

## 🧭 Workflow Example

### Scenario: Analyzing a High-Risk District

#### Step 1: Check the Dashboard
1. Navigate to **Dashboard** (`/dashboard`)
2. View the **"Highest Risk"** card - e.g., "District A"
3. Note the **5-Year Projection** - e.g., "345,600 expected migrants"
4. Review the **Top Risk Districts** chart

#### Step 2: Analyze Imbalance
1. Navigate to **Imbalance Engine** (`/imbalance`)
2. Select **"District A"** from the dropdown
3. Click **"Analyze"**
4. Review:
   - **Composite Score**: e.g., 0.742 (High Risk)
   - **National Rank**: e.g., #12 of 247
   - **Component Indicators**: Economic, Healthcare, Education, Infrastructure
   - **Correlation**: r = 0.78 (strong relationship with migration)

#### Step 3: Review Forecast
1. Navigate to **Forecast Engine** (`/forecast`)
2. View the **5-Year Baseline Projection** chart
3. Note the **confidence intervals** (95% CI)
4. Review **validation metrics**:
   - RMSE: 3.21
   - Confidence: 95%
   - Annual Growth: +8.2%

#### Step 4: Run a Simulation
1. Navigate to **Simulation Wizard** (`/simulation`)
2. Select **"District A"** as the target
3. Enter **Budget**: e.g., ₹50,000,000
4. Adjust **Policy Levers** (must sum to 100%):
   - Jobs: 40%
   - Healthcare: 25%
   - Education: 20%
   - Infrastructure: 15%
5. Click **"Run Multi-Lever Simulation"**
6. Review results:
   - **Baseline**: 68,750 migrants (no intervention)
   - **Projected**: 58,300 migrants (with intervention)
   - **Reduction**: 15.2%
   - **Confidence**: 87%

#### Step 5: Generate Budget Brief
1. Navigate to **Budget Brief** (`/brief`)
2. Select **"District A"** and **"Simulation #1"**
3. Click **"Generate Policy Brief"**
4. Review the comprehensive brief:
   - Executive Summary
   - Baseline Assessment
   - Proposed Intervention
   - Projected Outcomes
   - Statistical Validation
   - Policy Recommendations
5. Click **"Export PDF"** (simulated - would download in production)

#### Step 6: Track Feedback
1. Navigate to **Feedback Tracking** (`/feedback`)
2. Click **"Record New Feedback"**
3. Enter details:
   - District: "District A"
   - Policy Name: "Job Creation Initiative 2026"
   - Status: "Proposed" (or Approved, Implemented, Rejected)
   - Budget: ₹50,000,000
   - Outcomes: "Policy submitted to State Planning Commission for Q2 2026 approval"
4. Click **"Submit Feedback"**
5. View the new entry in the feedback list and charts

---

## 🤖 Using the AI Chatbot

### Opening the Chat
Click the **blue circular button** in the bottom-right corner.

### Sample Questions

**About Imbalance Scores:**
> "What does the imbalance score mean?"

**About Forecasts:**
> "How does the ARIMA forecast work?"

**About Simulations:**
> "What are the best policy levers to use?"

**About Validation:**
> "What is RMSE and why does it matter?"

**About Briefs:**
> "How do I generate a budget justification?"

**About Data:**
> "What data sources does CitySpark use?"

**General Help:**
> "What can you help me with?"

The chatbot provides **grounded, evidence-based responses** using rule-based logic. In production, this could be enhanced with OpenAI API integration.

---

## 🔐 User Roles

### Admin
- **Full Access** to all modules
- Can manage users (in production)
- Can modify system settings

### Policy Analyst
- View all analytics
- Run simulations
- Generate budget briefs
- Track feedback
- Use chatbot

### Viewer
- **Read-only access**
- View dashboards and reports
- No editing or simulation capabilities

---

## 📊 Understanding the Data

### Mock Data vs Production
Currently, the platform uses **mock data** for demonstration:
- Dashboard metrics are simulated
- Forecast projections are sample ARIMA outputs
- Simulation results use simplified impact calculations
- Feedback tracking uses Supabase KV store (real persistence)

In **production**, you would:
1. Import real migration data (XLS, CSV)
2. Connect to health infrastructure databases
3. Integrate VIIRS night-light GeoTIFF data
4. Implement real ARIMA training (statsmodels, scikit-learn)
5. Train simulation models on historical interventions
6. Connect to PostgreSQL for structured analytics

---

## 🎯 Key Metrics Explained

### Imbalance Score (0-1)
- **0.0 - 0.3**: Low Risk (balanced region)
- **0.3 - 0.5**: Moderate Risk (some imbalances)
- **0.5 - 0.7**: High Risk (significant imbalances)
- **0.7 - 1.0**: Critical Risk (urgent intervention needed)

### Correlation (r)
- **r ≥ 0.6**: Strong relationship (statistically significant)
- **p < 0.05**: Confident the relationship is real

### RMSE (Root Mean Square Error)
- **Lower is better**: 3.2% means predictions are ±3.2% accurate on average
- Industry standard: <5% is considered good for migration forecasts

### Confidence Level
- **95%**: Standard statistical confidence (most forecasts)
- **85-90%**: Typical for simulation scenarios (based on historical data)

---

## 🛠 Technical Notes

### Authentication
- JWT tokens stored in session (Supabase client handles this)
- Auto-refresh enabled
- Tokens expire after inactivity

### Data Persistence
- **User Data**: Supabase Auth
- **Feedback**: Supabase KV Store (key-value pairs)
- **Analytics**: Mock data (would be PostgreSQL in production)

### API Endpoints
All backend routes are prefixed with `/make-server-13260aab/`:

- `POST /signup` - Create new user
- `GET /dashboard/summary` - Dashboard metrics
- `GET /imbalance/districts` - List districts
- `POST /imbalance/analyze` - Analyze district
- `GET /forecast/baseline` - ARIMA forecast
- `POST /simulation/run` - Run simulation
- `GET /feedback` - Get all feedback
- `POST /feedback` - Submit feedback
- `POST /chat` - AI chatbot

---

## 📱 Responsive Design

CitySpark is fully responsive:
- **Mobile** (< 768px): Stacked layouts, collapsible sidebar
- **Tablet** (768px - 1024px): 2-column grids
- **Desktop** (> 1024px): Full 3-4 column layouts with sidebar

Test on different screen sizes to see the adaptive design!

---

## 🎨 Design System

### Colors
- **Background**: #F8FAFC (Neutral light gray)
- **Primary**: #1E3A8A (Deep navy - institutional)
- **Accent**: #3B82F6 (Blue - highlights)
- **Destructive**: #DC2626 (Red - high risk)
- **Success**: #10B981 (Green - positive outcomes)

### Typography
- **Font**: Poppins (Google Fonts)
- **Weights**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- Based on 12-16px rhythm
- Consistent padding/margins across components

---

## 🔍 Troubleshooting

### Can't Log In?
- Ensure you've created an account first via `/signup`
- Check email/password spelling
- Passwords are case-sensitive

### Page Not Loading?
- Check browser console for errors
- Ensure you're logged in for protected pages
- Clear cache and refresh

### Chatbot Not Responding?
- Ensure backend is running
- Check browser console for API errors
- Try rephrasing your question

### Data Not Updating?
- Mock data is static (refresh won't change it)
- Feedback tracking DOES persist (uses real database)
- In production, all data would be dynamic

---

## 🚀 Next Steps

1. **Explore All Modules** - Click through each sidebar link
2. **Try the Chatbot** - Ask questions about features
3. **Run Multiple Simulations** - Compare different lever allocations
4. **Generate Briefs** - Practice creating policy justifications
5. **Track Feedback** - Submit multiple policies and view trends

---

## 📚 Additional Resources

- See `/CITYSPARK_README.md` for comprehensive documentation
- Backend API code: `/supabase/functions/server/index.tsx`
- Frontend components: `/src/app/pages/` and `/src/app/components/`

---

**Welcome to CitySpark - Where data-driven policy meets institutional excellence!**
