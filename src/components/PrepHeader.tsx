
import { BookOpen, GraduationCap, Zap } from "lucide-react";

export const PrepHeader = () => {
  return (
    <header className="flex flex-col items-center justify-center animate-fade-in py-6">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-90">
          <GraduationCap className="h-7 w-7 text-gray-800 transition-all duration-300" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700">Prep Mate</h1>
        <div className="bg-blue-100 p-3 rounded-full ml-1 transition-all duration-300 hover:scale-110 active:scale-90">
          <BookOpen className="h-6 w-6 text-blue-500 transition-all duration-300" />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <p className="text-muted-foreground flex items-center gap-1">
          Upload. Learn. Repeat.
          <span className="text-green-500 ml-1">✓</span>
        </p>
        <div className="flex items-center text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
          <Zap className="h-3 w-3 mr-1" />
          Lyzr Powered
        </div>
      </div>
    </header>
  );
};
