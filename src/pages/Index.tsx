import { useState } from "react";
import { toast } from "sonner";
import { PrepHeader } from "@/components/PrepHeader";
import { StudyModeButtons } from "@/components/StudyModeButtons";
import { StudyContent } from "@/components/StudyContent";
import { SummaryOutput } from "@/components/study-outputs/SummaryOutput";
import { QuestionsOutput } from "@/components/study-outputs/QuestionsOutput";
import { QuizOutput } from "@/components/study-outputs/QuizOutput";
import { FlashcardsOutput } from "@/components/study-outputs/FlashcardsOutput";
import { processStudyContent } from "@/utils/studyContentProcessor";

type StudyMode = "summary" | "questions" | "quiz" | "flashcards";

const Index = () => {
  const [studyContent, setStudyContent] = useState("");
  const [activeMode, setActiveMode] = useState<StudyMode>("summary");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Study materials state
  const [summaryPoints, setSummaryPoints] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    question: string;
    options: string[];
    correctAnswerIndex: number;
  }>>([]);
  const [flashcards, setFlashcards] = useState<Array<{
    front: string;
    back: string;
  }>>([]);

  const handleGenerateStudyMaterials = async () => {
    if (studyContent.trim().length < 10) {
      toast.error("Please enter more study content to generate materials.");
      return;
    }

    setIsLoading(true);
    setApiError(null);
    
    try {
      toast.info("Connecting to Lyzr API to generate study materials...");

      // Process the study content using the Lyzr API
      const processedContent = await processStudyContent(studyContent);
      
      // Update the state with the processed content
      setSummaryPoints(processedContent.summaryPoints);
      setQuestions(processedContent.questions);
      setQuizQuestions(processedContent.quizQuestions);
      setFlashcards(processedContent.flashcards);
      
      toast.success("Study materials generated successfully!");
    } catch (error) {
      console.error("Error generating study materials:", error);
      setApiError("Failed to connect to Lyzr API. Please try again later.");
      toast.error("Failed to generate study materials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render the active output component based on mode
  const renderActiveOutput = () => {
    // Display API error if one occurred
    if (apiError && !isLoading) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
          <h3 className="text-red-700 font-medium mb-2">Connection Error</h3>
          <p className="text-red-600">{apiError}</p>
          <p className="text-red-500 mt-4 text-sm">Using fallback content instead. Please try again later.</p>
        </div>
      );
    }

    switch (activeMode) {
      case "summary":
        return <SummaryOutput summaryPoints={summaryPoints} isLoading={isLoading} />;
      case "questions":
        return <QuestionsOutput questions={questions} isLoading={isLoading} />;
      case "quiz":
        return <QuizOutput quizQuestions={quizQuestions} isLoading={isLoading} />;
      case "flashcards":
        return <FlashcardsOutput flashcards={flashcards} isLoading={isLoading} />;
      default:
        return <SummaryOutput summaryPoints={summaryPoints} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ff]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PrepHeader />
        
        <StudyModeButtons 
          activeMode={activeMode} 
          setActiveMode={setActiveMode} 
        />
        
        <div className="space-y-6">
          <StudyContent 
            content={studyContent}
            setContent={setStudyContent}
            onGenerateStudyMaterials={handleGenerateStudyMaterials}
            isLoading={isLoading}
          />
          
          {renderActiveOutput()}
        </div>
      </div>
    </div>
  );
};

export default Index;
