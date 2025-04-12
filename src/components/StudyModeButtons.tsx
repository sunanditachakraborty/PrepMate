
import { 
  ListChecks, 
  HelpCircle,
  FlaskConical,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StudyMode = "summary" | "questions" | "quiz" | "flashcards";

interface StudyModeButtonsProps {
  activeMode: StudyMode;
  setActiveMode: (mode: StudyMode) => void;
}

export const StudyModeButtons = ({ activeMode, setActiveMode }: StudyModeButtonsProps) => {
  const modes = [
    {
      id: "summary" as StudyMode,
      label: "Summary",
      icon: ListChecks,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      hoverColor: "hover:bg-green-100"
    },
    {
      id: "questions" as StudyMode,
      label: "Questions",
      icon: HelpCircle,
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      hoverColor: "hover:bg-amber-100"
    },
    {
      id: "quiz" as StudyMode,
      label: "Quiz",
      icon: FlaskConical,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      hoverColor: "hover:bg-red-100"
    },
    {
      id: "flashcards" as StudyMode,
      label: "Flashcards",
      icon: Layers,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      hoverColor: "hover:bg-blue-100"
    }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 my-6">
      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <Button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={cn(
              "study-btn py-6 px-6 flex items-center gap-2 border",
              mode.bgColor,
              mode.textColor,
              mode.hoverColor,
              isActive ? "ring-2 ring-primary shadow-md" : "ring-0"
            )}
            variant="ghost"
          >
            <mode.icon className="h-5 w-5" />
            <span className="font-medium">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
