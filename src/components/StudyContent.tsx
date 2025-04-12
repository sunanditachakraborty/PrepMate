
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
    <Card className="prep-card animate-scale-in w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-prep-600" />
          Your Study Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            placeholder="Paste or type your study content here..."
            className="min-h-[200px] resize-y border-muted focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <div className="absolute bottom-4 right-4">
            <Button 
              onClick={onGenerateStudyMaterials}
              disabled={content.trim().length < 10 || isLoading}
              className="bg-prep-500 hover:bg-prep-600 text-white rounded-full h-10 w-10 p-2 shadow-md transition-all duration-300"
              size="icon"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {charCount} characters entered. Click the send button to generate study materials.
        </div>
      </CardContent>
    </Card>
  );
};
