'use client'

import * as React from 'react'
import { redirect } from 'next/navigation'

export default function HomePage() {
  React.useEffect(() => {
    redirect('/workspaces')
  }, [])
  
  return null
}
