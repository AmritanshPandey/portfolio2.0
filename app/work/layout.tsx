import { StudyTracker } from "@/components/study/study-tracker"

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StudyTracker />
    </>
  )
}
