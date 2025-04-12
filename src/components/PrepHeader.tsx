
import { BookOpen, GraduationCap } from "lucide-react";

export const PrepHeader = () => {
  return (
    <header className="flex flex-col items-center justify-center animate-fade-in py-6">
      <div className="flex items-center gap-3">
        <div className="bg-prep-200 p-3 rounded-full">
          <GraduationCap className="h-7 w-7 text-gray-800" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Prep Mate</h1>
        <div className="bg-blue-100 p-2 rounded-lg ml-1">
          <BookOpen className="h-5 w-5 text-blue-500" />
        </div>
      </div>
      <p className="text-muted-foreground mt-2 flex items-center gap-1">
        Upload. Learn. Repeat.
        <span className="text-green-500 ml-1">✓</span>
      </p>
    </header>
  );
};
