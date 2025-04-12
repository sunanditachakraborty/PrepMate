
import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionsOutputProps {
  questions: string[];
  isLoading: boolean;
}

export const QuestionsOutput = ({ questions, isLoading }: QuestionsOutputProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 rounded-xl w-full animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center space-y-0">
        <div className="bg-amber-50 p-1.5 rounded-full mr-2">
          <HelpCircle className="h-5 w-5 text-amber-700" />
        </div>
        <CardTitle className="text-lg text-gray-700">Study Questions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div 
                  className="h-5 bg-gray-100 rounded animate-pulse-light"
                  style={{ width: `${90 - i * 5}%` }}
                />
                <div 
                  className="h-5 bg-gray-100 rounded animate-pulse-light"
                  style={{ width: `${70 - i * 10}%` }}
                />
              </div>
            ))}
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-5">
            {questions.length > 0 && (
              <div className="pb-2 text-gray-600 font-medium border-b border-gray-100">
                Questions on Electric Flux Calculation
              </div>
            )}
            {questions.map((question, index) => (
              <div 
                key={index} 
                className="animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-gray-700 flex gap-2">
                  <span className="text-gray-500">-</span>
                  <span>{question}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">
            Enter your study content and select generate to create questions.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
