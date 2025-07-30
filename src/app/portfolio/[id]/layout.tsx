import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  params: {
    id: string
  }
}

export default function PortfolioLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}