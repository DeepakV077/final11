import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Building2, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Building2 className="w-10 h-10 text-primary" />
          <span className="text-2xl font-bold text-foreground">CitySpark</span>
        </div>
        
        <div className="text-9xl font-bold text-primary mb-4">404</div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Page Not Found
        </h1>
        
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button onClick={() => navigate('/')} size="lg">
          <Home className="w-4 h-4 mr-2" />
          Return Home
        </Button>
      </div>
    </div>
  );
}
