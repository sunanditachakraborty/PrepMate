
import { useState } from "react";
import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardsOutputProps {
  flashcards: Flashcard[];
  isLoading: boolean;
}

export const FlashcardsOutput = ({ flashcards, isLoading }: FlashcardsOutputProps) => {
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);

  const toggleFlip = (index: number) => {
    const newFlipped = [...flippedCards];
    newFlipped[index] = !newFlipped[index];
    setFlippedCards(newFlipped);
  };

  return (
    <Card className="prep-card w-full animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center space-y-0">
        <div className="bg-blue-50 p-1.5 rounded-md mr-2">
          <Layers className="h-5 w-5 text-blue-700" />
        </div>
        <CardTitle className="text-lg">Flashcards</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 border rounded-lg bg-muted animate-pulse-light" />
            ))}
          </div>
        ) : flashcards.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {flashcards.map((card, index) => (
              <div 
                key={index}
                className={`relative h-full min-h-[140px] cursor-pointer transition-all duration-500 animate-slide-in ${
                  flippedCards[index] ? "bg-blue-50" : "bg-white"
                }`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  transformStyle: "preserve-3d" 
                }}
                onClick={() => toggleFlip(index)}
              >
                <div
                  className={`absolute inset-0 flex flex-col justify-between p-4 border rounded-lg shadow-sm transition-all duration-500 ${
                    flippedCards[index] ? "opacity-0 rotate-y-180" : "opacity-100"
                  }`}
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{card.front}</h3>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline" 
                      size="sm"
                      className="text-xs mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(index);
                      }}
                    >
                      Show Answer
                    </Button>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 flex flex-col justify-between p-4 border rounded-lg bg-blue-50 shadow-sm transition-all duration-500 ${
                    flippedCards[index] ? "opacity-100" : "opacity-0 rotate-y-180"
                  }`}
                >
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Answer:</p>
                    <p className="text-gray-800">{card.back}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(index);
                      }}
                    >
                      Show Question
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">
            Enter your study content and select generate to create flashcards.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
