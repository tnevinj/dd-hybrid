import { Metadata } from 'next';
import { HybridGPDashboardRefactored } from '@/components/gp-portal/HybridGPDashboardRefactored';

export const metadata: Metadata = {
  title: 'GP Portal | dd-hybrid',
  description: 'General Partner portal for deal submissions and company management',
};

export default function GPPortalPage() {
  return <HybridGPDashboardRefactored />;
}