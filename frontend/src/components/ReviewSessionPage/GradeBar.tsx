import { Button } from "@/components/ui/button"

interface Props {
  onGrade: (grade: number) => void
  activeGrade: number | null
}

const grades = [
  { id: 0, label: "Провал", interval: "", variant: "destructive" },
  { id: 1, label: "Ошибка", interval: "", variant: "destructive" },
  {id: 2,label: "Почти вспомнил",interval: "",variant: "destructive",},
  { id: 3, label: "С трудом", interval: "", variant: "outline" },
  { id: 4, label: "Хорошо", interval: "", variant: "secondary" },
  { id: 5, label: "Легко", interval: "", variant: "default" },
]

export function GradeBar({ onGrade, activeGrade }: Props) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {grades.map((grade) => {
        const isActive = activeGrade === grade.id
        return (
          <Button
            key={grade.id}
            variant={grade.variant as any}
            onClick={() => onGrade(grade.id)}
            className={`h-20 flex-col gap-1 transition-transform duration-150 ${
              isActive
                ? "scale-95 ring-2 ring-ring ring-offset-2 ring-offset-background"
                : ""
            }`}
          >
            <span className="text-lg">{grade.id}</span>
            <span>{grade.label}</span>
            <span className="text-xs opacity-70">{grade.interval}</span>
          </Button>
        )
      })}
    </div>
  )
}
