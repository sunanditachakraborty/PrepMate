
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

// Function to process text formatting for bold and headings
const formatText = (text: string) => {
  // Replace bold text (**text**) with styled spans
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="bold-text">$1</span>');
  
  // Replace heading text (# text) with styled headings
  formattedText = formattedText.replace(/^# (.*?)$/gm, '<div class="heading">$1</div>');
  
  return formattedText;
};

// Get 3-5 flashcards from the flashcards array
const getDisplayFlashcards = (cards: Flashcard[]) => {
  // Make sure we have at least 3 flashcards
  if (cards.length < 3) {
    // If we have fewer than 3 cards, duplicate existing ones to reach 3
    const duplicatedCards = [...cards];
    while (duplicatedCards.length < 3) {
      const cardToDuplicate = cards[duplicatedCards.length % cards.length];
      duplicatedCards.push({
        front: `${cardToDuplicate.front} (continued)`,
        back: cardToDuplicate.back
      });
    }
    return duplicatedCards;
  }
  
  // Return 3-5 cards (all if ≤5, or just 5 if more)
  return cards.slice(0, Math.min(5, cards.length));
};

// Array of pastel background colors for cards
const cardColors = [
  "bg-blue-100",
  "bg-green-100",
  "bg-pink-100",
  "bg-purple-100",
  "bg-yellow-100",
  "bg-orange-100",
  "bg-amber-100",
  "bg-teal-100",
  "bg-sky-100",
  "bg-indigo-100",
];

// Array of flipped card colors - more saturated versions
const flippedColors = [
  "bg-blue-200",
  "bg-green-200",
  "bg-pink-200",
  "bg-purple-200",
  "bg-yellow-200",
  "bg-orange-200",
  "bg-amber-200",
  "bg-teal-200", 
  "bg-sky-200",
  "bg-indigo-200",
];

export const FlashcardsOutput = ({ flashcards, isLoading }: FlashcardsOutputProps) => {
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);

  const toggleFlip = (index: number) => {
    const newFlipped = [...flippedCards];
    newFlipped[index] = !newFlipped[index];
    setFlippedCards(newFlipped);
  };

  // Make sure we have 3-5 flashcards to display
  const displayFlashcards = getDisplayFlashcards(flashcards);

  return (
    <Card className="prep-card w-full animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center space-y-0">
        <div className="bg-blue-50 p-1.5 rounded-md mr-2 animate-bounce">
          <Layers className="h-5 w-5 text-blue-700" />
        </div>
        <CardTitle className="text-lg">Flashcards</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 border rounded-lg bg-muted animate-pulse-light" />
            ))}
          </div>
        ) : displayFlashcards.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {displayFlashcards.map((card, index) => {
              const cardColor = cardColors[index % cardColors.length];
              const flippedColor = flippedColors[index % flippedColors.length];
              
              return (
                <div 
                  key={index}
                  className={`relative h-full min-h-[140px] cursor-pointer transition-all duration-500 animate-slide-in shadow-md rounded-lg ${
                    flippedCards[index] ? flippedColor : cardColor
                  }`}
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    transformStyle: "preserve-3d" 
                  }}
                  onClick={() => toggleFlip(index)}
                >
                  <div
                    className={`absolute inset-0 flex flex-col justify-between p-4 border rounded-lg transition-all duration-500 ${cardColor} ${
                      flippedCards[index] ? "opacity-0 rotate-y-180" : "opacity-100"
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-gray-800" 
                         dangerouslySetInnerHTML={{ __html: formatText(card.front) }} />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline" 
                        size="sm"
                        className="text-xs mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-200"
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
                    className={`absolute inset-0 flex flex-col justify-between p-4 border rounded-lg ${flippedColor} transition-all duration-500 ${
                      flippedCards[index] ? "opacity-100" : "opacity-0 rotate-y-180"
                    }`}
                  >
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Answer:</p>
                      <p className="text-gray-800" 
                         dangerouslySetInnerHTML={{ __html: formatText(card.back) }} />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 active:bg-blue-200"
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
              );
            })}
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
