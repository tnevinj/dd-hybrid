import { DueDiligenceProvider } from '@/contexts/DueDiligenceContext'

export default function DueDiligenceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DueDiligenceProvider>
      {children}
    </DueDiligenceProvider>
  )
}