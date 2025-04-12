
import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionsOutputProps {
  questions: string[];
  isLoading: boolean;
}

export const QuestionsOutput = ({ questions, isLoading }: QuestionsOutputProps) => {
  return (
    <Card className="prep-card w-full animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center space-y-0">
        <div className="bg-amber-50 p-1.5 rounded-md mr-2">
          <HelpCircle className="h-5 w-5 text-amber-700" />
        </div>
        <CardTitle className="text-lg">Study Questions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div 
                  className="h-5 bg-muted rounded animate-pulse-light"
                  style={{ width: `${90 - i * 5}%` }}
                />
                <div 
                  className="h-5 bg-muted rounded animate-pulse-light"
                  style={{ width: `${70 - i * 10}%` }}
                />
              </div>
            ))}
          </div>
        ) : questions.length > 0 ? (
          <ol className="space-y-4">
            {questions.map((question, index) => (
              <li 
                key={index} 
                className="animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="font-medium text-gray-800">
                  {index + 1}. {question}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground text-center py-6">
            Enter your study content and select generate to create questions.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
