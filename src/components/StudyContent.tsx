
import { useState, useRef, useEffect } from "react";
import { FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudyContentProps {
  content: string;
  setContent: (content: string) => void;
  onGenerateStudyMaterials: () => void;
  isLoading: boolean;
}

export const StudyContent = ({ 
  content, 
  setContent, 
  onGenerateStudyMaterials,
  isLoading
}: StudyContentProps) => {
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100 rounded-xl mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="bg-amber-100 p-1.5 rounded-full">
            <FileText className="h-5 w-5 text-gray-700" />
          </div>
          <span className="text-gray-700">Your Study Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            placeholder="Paste or type your study content here..."
            className="min-h-[200px] resize-y border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-lg"
          />
          <div className="absolute bottom-4 right-4">
            <Button 
              onClick={onGenerateStudyMaterials}
              disabled={content.trim().length < 10 || isLoading}
              className="bg-amber-100 hover:bg-amber-200 text-gray-700 rounded-full h-10 w-10 p-2 shadow-sm transition-all duration-300"
              size="icon"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {charCount} characters entered. Click the send button to generate study materials.
        </div>
      </CardContent>
    </Card>
  );
};
