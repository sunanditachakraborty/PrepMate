
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
      bgColor: "bg-white",
      textColor: "text-gray-600",
      activeColor: "bg-green-100",
      activeTextColor: "text-green-700",
      hoverColor: "hover:bg-green-50"
    },
    {
      id: "questions" as StudyMode,
      label: "Questions",
      icon: HelpCircle,
      bgColor: "bg-white",
      textColor: "text-gray-600",
      activeColor: "bg-amber-100",
      activeTextColor: "text-amber-700",
      hoverColor: "hover:bg-amber-50"
    },
    {
      id: "quiz" as StudyMode,
      label: "Quiz",
      icon: FlaskConical,
      bgColor: "bg-white",
      textColor: "text-gray-600",
      activeColor: "bg-red-100",
      activeTextColor: "text-red-700",
      hoverColor: "hover:bg-red-50"
    },
    {
      id: "flashcards" as StudyMode,
      label: "Flashcards",
      icon: Layers,
      bgColor: "bg-white",
      textColor: "text-gray-600",
      activeColor: "bg-blue-100",
      activeTextColor: "text-blue-700",
      hoverColor: "hover:bg-blue-50"
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
              "py-4 px-6 rounded-2xl flex items-center gap-2 border shadow-sm transition-all duration-300",
              isActive ? mode.activeColor : mode.bgColor,
              isActive ? mode.activeTextColor : "text-gray-600",
              "hover:scale-105 active:scale-95",
              !isActive && mode.hoverColor
            )}
            variant="ghost"
          >
            <mode.icon 
              className={cn(
                "h-5 w-5 transition-all duration-300", 
                isActive ? "scale-110" : "scale-100"
              )} 
            />
            <span className="font-medium">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
