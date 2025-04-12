
import { useState, useEffect } from "react";
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
    
    try {
      toast.info("Generating study materials...");

      // Process the study content
      const processedContent = await processStudyContent(studyContent);
      
      // Update the state with the processed content
      setSummaryPoints(processedContent.summaryPoints);
      setQuestions(processedContent.questions);
      setQuizQuestions(processedContent.quizQuestions);
      setFlashcards(processedContent.flashcards);
      
      toast.success("Study materials generated successfully!");
    } catch (error) {
      console.error("Error generating study materials:", error);
      toast.error("Failed to generate study materials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render the active output component based on mode
  const renderActiveOutput = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="prep-container">
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
