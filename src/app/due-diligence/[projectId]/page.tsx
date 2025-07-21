'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { DDProjectDetail } from '@/components/due-diligence/DDProjectDetail'

export default function DDProjectPage() {
  const params = useParams()
  const projectId = params.projectId as string

  return <DDProjectDetail projectId={projectId} />
}