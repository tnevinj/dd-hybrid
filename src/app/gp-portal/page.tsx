import { Metadata } from 'next';
import { HybridGPDashboard } from '@/components/gp-portal/HybridGPDashboard';

export const metadata: Metadata = {
  title: 'GP Portal | dd-hybrid',
  description: 'General Partner portal for deal submissions and company management',
};

export default function GPPortalPage() {
  // In a real app, you would fetch user data here
  const user = {
    id: 'user_1',
    email: 'gp@example.com',
    name: 'GP User',
    navigationMode: 'assisted' // Default to assisted mode
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <HybridGPDashboard user={user} />
    </div>
  );
}