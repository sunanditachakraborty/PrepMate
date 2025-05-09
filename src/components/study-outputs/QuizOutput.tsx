import { FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface QuizOutputProps {
  quizQuestions: QuizQuestion[];
  isLoading: boolean;
}

const formatText = (text: string) => {
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="bold-text">$1</span>');
  formattedText = formattedText.replace(/^# (.*?)$/gm, '<div class="heading">$1</div>');
  return formattedText;
};

const getDisplayQuestions = (questions: QuizQuestion[]) => {
  if (questions.length > 0) {
    return [questions[0]];
  }
  return [];
};

export const QuizOutput = ({ quizQuestions, isLoading }: QuizOutputProps) => {
  const displayQuestions = getDisplayQuestions(quizQuestions);

  const cardColors = [
    "bg-red-50 border-red-100",
    "bg-amber-50 border-amber-100",
    "bg-sky-50 border-sky-100",
    "bg-green-50 border-green-100",
    "bg-purple-50 border-purple-100",
  ];

  return (
    <Card className="prep-card w-full animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center space-y-0">
        <div className="bg-red-50 p-1.5 rounded-md mr-2 animate-bounce">
          <FlaskConical className="h-5 w-5 text-red-700" />
        </div>
        <CardTitle className="text-lg">Knowledge Check</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 bg-muted rounded animate-pulse-light w-[90%]" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-muted animate-pulse-light" />
                      <div 
                        className="h-4 bg-muted rounded animate-pulse-light"
                        style={{ width: `${75 - j * 5}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : displayQuestions.length > 0 ? (
          <div className="space-y-6">
            {displayQuestions.map((quiz, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 animate-slide-in ${cardColors[index % cardColors.length]} shadow-sm`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="font-medium text-gray-800 mb-3 text-lg">
                  {index + 1}. <span dangerouslySetInnerHTML={{ __html: formatText(quiz.question) }} />
                </p>
                <RadioGroup defaultValue={`${quiz.correctAnswerIndex}`}>
                  {quiz.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-start space-x-2 py-1.5 animate-fade-in" style={{ animationDelay: `${optionIndex * 50 + 100}ms` }}>
                      <RadioGroupItem 
                        value={`${optionIndex}`} 
                        id={`q${index}-option${optionIndex}`}
                        className={optionIndex === quiz.correctAnswerIndex ? "text-green-600" : ""}
                      />
                      <Label 
                        htmlFor={`q${index}-option${optionIndex}`}
                        className={optionIndex === quiz.correctAnswerIndex ? "text-green-600 font-medium" : ""}
                      >
                        <span dangerouslySetInnerHTML={{ __html: formatText(option) }} />
                        {optionIndex === quiz.correctAnswerIndex && (
                          <span className="ml-2 text-green-600 text-sm">(Correct)</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">
            Enter your study content and select generate to create content-specific quiz questions.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
