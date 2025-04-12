
import { ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryOutputProps {
  summaryPoints: string[];
  isLoading: boolean;
}

export const SummaryOutput = ({ summaryPoints, isLoading }: SummaryOutputProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 rounded-xl w-full animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center space-y-0">
        <div className="bg-green-50 p-1.5 rounded-full mr-2">
          <ListChecks className="h-5 w-5 text-green-700" />
        </div>
        <CardTitle className="text-lg text-gray-700">Key Points</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-6 bg-gray-100 rounded animate-pulse-light"
                style={{ width: `${85 - i * 5}%` }}
              />
            ))}
          </div>
        ) : summaryPoints.length > 0 ? (
          <div className="space-y-5">
            {summaryPoints.length > 0 && (
              <div className="pb-2 text-gray-600 font-medium border-b border-gray-100">
                Summary of Key Concepts
              </div>
            )}
            {summaryPoints.map((point, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-gray-500">-</span>
                <span className="text-gray-700">{point}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">
            Enter your study content and select generate to create a summary.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
