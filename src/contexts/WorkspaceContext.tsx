'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { InvestmentWorkspace } from '@/types/workspace'
import { WorkProduct } from '@/types/work-product'

interface WorkspaceContextType {
  currentWorkspace?: InvestmentWorkspace
  currentWorkProduct?: WorkProduct
  setCurrentWorkspace: (workspace: InvestmentWorkspace | undefined) => void
  setCurrentWorkProduct: (workProduct: WorkProduct | undefined) => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<InvestmentWorkspace | undefined>()
  const [currentWorkProduct, setCurrentWorkProduct] = useState<WorkProduct | undefined>()

  return (
    <WorkspaceContext.Provider value={{
      currentWorkspace,
      currentWorkProduct,
      setCurrentWorkspace,
      setCurrentWorkProduct
    }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider')
  }
  return context
}

// Optional hook that doesn't throw if used outside provider
export function useWorkspaceContextSafe() {
  const context = useContext(WorkspaceContext)
  return context
}