'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DealStructuringDetail } from '@/components/deal-structuring';

const DealStructuringDetailPage: React.FC = () => {
  const params = useParams();
  const dealId = params.dealId as string;

  return <DealStructuringDetail dealId={dealId} />;
};

export default DealStructuringDetailPage;