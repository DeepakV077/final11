import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MessageSquare, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';
import { getMockFeedback } from '../lib/mockData';

export default function FeedbackTracking() {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    district: '',
    policyName: '',
    status: 'proposed',
    budget: '',
    outcomes: '',
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-13260aab/feedback`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch feedback');

      const data = await response.json();
      setFeedbackList(data.feedback || []);
    } catch (err: any) {
      console.error('Fetch feedback error:', err);
      const mock = getMockFeedback();
      setFeedbackList(mock.feedback);
    }
  };

  const submitFeedback = async () => {
    if (!formData.district || !formData.policyName) {
      toast.error('Please fill required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-13260aab/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Failed to submit feedback');

      toast.success('Feedback recorded successfully');
      setShowForm(false);
      setFormData({
        district: '',
        policyName: '',
        status: 'proposed',
        budget: '',
        outcomes: '',
      });
      fetchFeedback();
    } catch (err: any) {
      console.error('Submit feedback error:', err);
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const adoptionRate = feedbackList.filter(f => f.status === 'implemented').length / Math.max(feedbackList.length, 1) * 100;
  const totalBudget = feedbackList
    .filter(f => f.status === 'implemented')
    .reduce((sum, f) => sum + (parseFloat(f.budget) || 0), 0);

  const statusData = [
    { name: 'Proposed', value: feedbackList.filter(f => f.status === 'proposed').length, color: '#64748B' },
    { name: 'Approved', value: feedbackList.filter(f => f.status === 'approved').length, color: '#3B82F6' },
    { name: 'Implemented', value: feedbackList.filter(f => f.status === 'implemented').length, color: '#10B981' },
    { name: 'Rejected', value: feedbackList.filter(f => f.status === 'rejected').length, color: '#DC2626' },
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Feedback Tracking</h2>
          <p className="text-muted-foreground mt-1">
            Monitor policy adoption rates, allocated budgets, and real-world outcomes
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Record New Feedback'}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Adoption Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {adoptionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {feedbackList.filter(f => f.status === 'implemented').length} of {feedbackList.length} policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Total Budget Allocated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ₹{(totalBudget / 10000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground mt-1">Implemented policies only</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Total Feedback Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {feedbackList.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all districts</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record Policy Feedback</CardTitle>
            <CardDescription>
              Track policy acceptance, budget allocation, and implementation outcomes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g., District A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="policyName">Policy Name</Label>
                <Input
                  id="policyName"
                  value={formData.policyName}
                  onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
                  placeholder="e.g., Job Creation Initiative 2026"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proposed">Proposed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="implemented">Implemented</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Allocated Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="e.g., 50000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcomes">Outcomes / Notes</Label>
              <Textarea
                id="outcomes"
                value={formData.outcomes}
                onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                placeholder="Document implementation outcomes, challenges, or additional context..."
                rows={4}
              />
            </div>

            <Button onClick={submitFeedback} disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Policy Status Distribution</CardTitle>
            <CardDescription>Breakdown by implementation stage</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No feedback data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation by District</CardTitle>
            <CardDescription>Total allocated budgets (implemented policies only)</CardDescription>
          </CardHeader>
          <CardContent>
            {feedbackList.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={feedbackList
                    .filter(f => f.status === 'implemented')
                    .map(f => ({ district: f.district, budget: parseFloat(f.budget) / 10000000 }))
                  }
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={12} label={{ value: '₹ Millions', position: 'insideBottom', offset: -5 }} />
                  <YAxis type="category" dataKey="district" stroke="#64748B" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="budget" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No budget data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>All Feedback Records</CardTitle>
          <CardDescription>Complete history of policy tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackList.length > 0 ? (
            <div className="space-y-4">
              {feedbackList.map((feedback, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{feedback.policyName}</h4>
                      <p className="text-sm text-muted-foreground">{feedback.district}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {feedback.status === 'implemented' && (
                        <span className="px-3 py-1 bg-chart-3/10 text-chart-3 text-xs font-medium rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Implemented
                        </span>
                      )}
                      {feedback.status === 'approved' && (
                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                          Approved
                        </span>
                      )}
                      {feedback.status === 'proposed' && (
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                          Proposed
                        </span>
                      )}
                      {feedback.status === 'rejected' && (
                        <span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Budget: </span>
                      <span className="font-medium text-foreground">
                        ₹{(parseFloat(feedback.budget) / 10000000).toFixed(2)}M
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date: </span>
                      <span className="font-medium text-foreground">
                        {new Date(feedback.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {feedback.outcomes && (
                    <p className="text-sm text-muted-foreground italic border-l-2 border-border pl-3">
                      {feedback.outcomes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No feedback records yet. Click "Record New Feedback" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
