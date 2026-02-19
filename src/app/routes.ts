import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedLayout from './components/ProtectedLayout';
import Dashboard from './pages/Dashboard';
import ImbalanceEngine from './pages/ImbalanceEngine';
import ForecastEngine from './pages/ForecastEngine';
import SimulationWizard from './pages/SimulationWizard';
import BudgetBrief from './pages/BudgetBrief';
import FeedbackTracking from './pages/FeedbackTracking';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: Signup,
  },
  {
    path: '/dashboard',
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
    ],
  },
  {
    path: '/imbalance',
    Component: ProtectedLayout,
    children: [
      { index: true, Component: ImbalanceEngine },
    ],
  },
  {
    path: '/forecast',
    Component: ProtectedLayout,
    children: [
      { index: true, Component: ForecastEngine },
    ],
  },
  {
    path: '/simulation',
    Component: ProtectedLayout,
    children: [
      { index: true, Component: SimulationWizard },
    ],
  },
  {
    path: '/brief',
    Component: ProtectedLayout,
    children: [
      { index: true, Component: BudgetBrief },
    ],
  },
  {
    path: '/feedback',
    Component: ProtectedLayout,
    children: [
      { index: true, Component: FeedbackTracking },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);