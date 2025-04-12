
import { ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryOutputProps {
  summaryPoints: string[];
  isLoading: boolean;
}

export const SummaryOutput = ({ summaryPoints, isLoading }: SummaryOutputProps) => {
  return (
    <Card className="prep-card w-full animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center space-y-0">
        <div className="bg-green-50 p-1.5 rounded-md mr-2">
          <ListChecks className="h-5 w-5 text-green-700" />
        </div>
        <CardTitle className="text-lg">Key Points</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-6 bg-muted rounded animate-pulse-light"
                style={{ width: `${85 - i * 5}%` }}
              />
            ))}
          </div>
        ) : summaryPoints.length > 0 ? (
          <ul className="space-y-3">
            {summaryPoints.map((point, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="flex-shrink-0 bg-amber-100 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-medium text-sm">
                  {index + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-6">
            Enter your study content and select generate to create a summary.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
