
// This file handles the connection to the Lyzr API for study content processing

interface ProcessedStudyContent {
  summaryPoints: string[];
  questions: string[];
  quizQuestions: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  }[];
  flashcards: {
    front: string;
    back: string;
  }[];
}

const LYZR_API_ENDPOINT = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYZR_API_KEY = "sk-default-fOy5QchYVtkjeC81Bnu5qu49lxpTZ7Hj";

export const processStudyContent = async (content: string): Promise<ProcessedStudyContent> => {
  try {
    // Make a request to the Lyzr API
    const response = await fetch(LYZR_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY
      },
      body: JSON.stringify({
        user_id: "prep-mate-user", // We can replace this with actual user ID if needed
        agent_id: "67fa741fb000e8ad1ec86c3a",
        session_id: "67fa741fb000e8ad1ec86c3a",
        message: content // Send the study content as the message
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Lyzr API error:", errorData);
      throw new Error(`Lyzr API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Lyzr API response:", data);

    // Parse the response from Lyzr
    // For now, we'll use a placeholder parsing logic
    // This should be adjusted based on the actual response format from Lyzr
    return parseResponseFromLyzr(data, content);
  } catch (error) {
    console.error("Error processing study content:", error);
    // Return fallback content in case of an error
    return getFallbackContent(content);
  }
};

// Function to parse the response from Lyzr
// This needs to be adjusted based on the actual response format
const parseResponseFromLyzr = (response: any, originalContent: string): ProcessedStudyContent => {
  // Here we're making assumptions about the Lyzr response format
  // You'll need to adjust this based on the actual response structure
  
  try {
    // If the response contains a formatted message with the study materials
    if (response.response) {
      const message = response.response;
      
      // Attempt to extract study materials from the response
      return {
        summaryPoints: extractSummaryPoints(message),
        questions: extractQuestions(message),
        quizQuestions: extractQuizQuestions(message),
        flashcards: extractFlashcards(message)
      };
    }
    
    // If we couldn't parse the response properly, return fallback content
    return getFallbackContent(originalContent);
  } catch (error) {
    console.error("Error parsing Lyzr response:", error);
    return getFallbackContent(originalContent);
  }
};

// Helper functions to extract different study materials from the response
const extractSummaryPoints = (message: string): string[] => {
  // Look for bullet points or numbered lists in the message
  const summaryRegex = /(?:summary|key points)(?::|.*?:)?\s*((?:[-*•]\s*[^-*•\n]+\n*)+)/i;
  const match = message.match(summaryRegex);
  
  if (match && match[1]) {
    return match[1]
      .split(/[-*•]\s*/)
      .filter(point => point.trim().length > 0)
      .map(point => point.trim());
  }
  
  // Fallback: Try to find sentences that might be summary points
  return message
    .split(/\.\s+/)
    .filter(sentence => sentence.length > 20 && sentence.length < 200)
    .map(sentence => sentence.trim())
    .slice(0, 5);
};

const extractQuestions = (message: string): string[] => {
  // Look for questions in the message
  const questionRegex = /(?:questions|study questions)(?::|.*?:)?\s*((?:\d+\.\s*[^?]+\?\s*)+)/i;
  const match = message.match(questionRegex);
  
  if (match && match[1]) {
    return match[1]
      .split(/\d+\.\s*/)
      .filter(question => question.includes('?'))
      .map(question => question.trim());
  }
  
  // Fallback: Try to find any question marks in the text
  return message
    .split('\n')
    .filter(line => line.includes('?'))
    .map(line => line.trim())
    .slice(0, 5);
};

const extractQuizQuestions = (message: string): { question: string; options: string[]; correctAnswerIndex: number; }[] => {
  // This is a complex task that would require more sophisticated parsing
  // For now, we'll return some placeholder quiz questions
  const quizSection = message.match(/(?:quiz|mcq|multiple choice)(?::|.*?:)?\s*([\s\S]+?)(?:\n\n|\Z)/i);
  
  if (quizSection && quizSection[1]) {
    const quizText = quizSection[1];
    const questions: { question: string; options: string[]; correctAnswerIndex: number; }[] = [];
    
    // Try to find questions with options (A, B, C, D format)
    const questionBlocks = quizText.split(/\d+\.\s+/).filter(block => block.trim().length > 0);
    
    for (const block of questionBlocks) {
      if (block.includes('A)') || block.includes('A.') || block.includes('a)') || block.includes('a.')) {
        const questionParts = block.split(/\n/).filter(part => part.trim().length > 0);
        
        if (questionParts.length >= 5) {  // Question + 4 options at minimum
          const question = questionParts[0].trim();
          const options = questionParts.slice(1, 5).map(option => {
            return option.replace(/^[A-Da-d][).]\s*/, '').trim();
          });
          
          // Try to find the correct answer indication
          const correctIndex = findCorrectAnswerIndex(block);
          
          questions.push({
            question,
            options,
            correctAnswerIndex: correctIndex
          });
          
          if (questions.length >= 3) break;
        }
      }
    }
    
    if (questions.length > 0) return questions;
  }
  
  // Return fallback quiz questions
  return [
    {
      question: "What is the main topic of this content?",
      options: [
        "Science",
        "History",
        "Mathematics",
        "Literature"
      ],
      correctAnswerIndex: 0  // Default to first option
    },
    {
      question: "Which of the following best describes the content?",
      options: [
        "Theoretical concepts",
        "Practical applications",
        "Historical overview",
        "Research findings"
      ],
      correctAnswerIndex: 0
    },
    {
      question: "What approach would best help understand this content?",
      options: [
        "Memorization",
        "Problem solving",
        "Critical analysis",
        "Group discussion"
      ],
      correctAnswerIndex: 2
    }
  ];
};

const findCorrectAnswerIndex = (block: string): number => {
  // Try to find indications of correct answer like "Correct answer: B" or "Answer: C"
  const correctAnswerMatch = block.match(/(?:correct|answer)(?::|is)?[^A-Da-d]*(A|B|C|D|a|b|c|d)/i);
  
  if (correctAnswerMatch && correctAnswerMatch[1]) {
    const letter = correctAnswerMatch[1].toUpperCase();
    return "ABCD".indexOf(letter);
  }
  
  // Default to first option
  return 0;
};

const extractFlashcards = (message: string): { front: string; back: string; }[] => {
  // Look for flashcard-like content in the message
  const flashcardRegex = /(?:flashcards|cards)(?::|.*?:)?\s*([\s\S]+?)(?:\n\n|\Z)/i;
  const match = message.match(flashcardRegex);
  
  if (match && match[1]) {
    const flashcardText = match[1];
    const flashcards: { front: string; back: string; }[] = [];
    
    // Try to find "Front: ... Back: ..." patterns
    const frontBackRegex = /Front:\s*([^\n]+)\s*Back:\s*([^\n]+)/gi;
    let flashcardMatch;
    
    while ((flashcardMatch = frontBackRegex.exec(flashcardText)) !== null) {
      if (flashcardMatch[1] && flashcardMatch[2]) {
        flashcards.push({
          front: flashcardMatch[1].trim(),
          back: flashcardMatch[2].trim()
        });
      }
      
      if (flashcards.length >= 3) break;
    }
    
    // If we found flashcards, return them
    if (flashcards.length > 0) return flashcards;
    
    // Try to find question-answer pairs
    const pairs = flashcardText.split(/\d+\.\s+/).filter(pair => pair.trim().length > 0);
    
    for (const pair of pairs) {
      if (pair.includes('?')) {
        const parts = pair.split('?');
        if (parts.length >= 2) {
          flashcards.push({
            front: parts[0].trim() + '?',
            back: parts[1].trim()
          });
          
          if (flashcards.length >= 3) break;
        }
      }
    }
    
    if (flashcards.length > 0) return flashcards;
  }
  
  // Return fallback flashcards
  return [
    {
      front: "What is the main concept discussed in this content?",
      back: "The content discusses key principles and applications in the subject area."
    },
    {
      front: "Why is this topic important?",
      back: "This topic forms a foundation for understanding more complex concepts and real-world applications."
    },
    {
      front: "How can this knowledge be applied?",
      back: "This knowledge can be applied to solve problems, make informed decisions, and develop further understanding in the field."
    }
  ];
};

// Provide fallback content in case we can't parse the Lyzr response
const getFallbackContent = (content: string): ProcessedStudyContent => {
  // Check content context to provide more relevant fallback
  const isScience = /(?:biology|chemistry|physics|science|equation|formula|experiment)/i.test(content);
  const isHistory = /(?:history|war|century|ancient|civilization|empire|king|queen)/i.test(content);
  const isMath = /(?:math|equation|formula|calculus|algebra|geometry|theorem)/i.test(content);
  
  if (isScience) {
    return {
      summaryPoints: [
        "The content discusses important scientific concepts and principles.",
        "Key scientific methods and processes are outlined.",
        "The relationship between different scientific phenomena is explained.",
        "Applications of scientific knowledge in real-world contexts are presented.",
        "Current understanding and potential future developments in the field are considered."
      ],
      questions: [
        "What are the main scientific principles discussed in the content?",
        "How do these scientific concepts apply to real-world situations?",
        "What methods are used to investigate the phenomena described?",
        "How do different aspects of this scientific topic relate to each other?",
        "What are the implications of these scientific findings?"
      ],
      quizQuestions: [
        {
          question: "Which scientific principle best explains the phenomena described?",
          options: [
            "Principle of conservation",
            "Principle of equilibrium",
            "Principle of uncertainty",
            "Principle of relativity"
          ],
          correctAnswerIndex: 0
        },
        {
          question: "What is the primary method used in this scientific field?",
          options: [
            "Experimental observation",
            "Theoretical modeling",
            "Data analysis",
            "Comparative studies"
          ],
          correctAnswerIndex: 0
        },
        {
          question: "How does this scientific knowledge benefit society?",
          options: [
            "Technological advancement",
            "Medical progress",
            "Environmental protection",
            "All of the above"
          ],
          correctAnswerIndex: 3
        }
      ],
      flashcards: [
        {
          front: "What are the key principles in this scientific field?",
          back: "The key principles include fundamental laws, established theories, and experimental methods that form the foundation of understanding in this area."
        },
        {
          front: "How is scientific evidence gathered in this context?",
          back: "Evidence is gathered through systematic observation, controlled experiments, data collection, and analysis using established scientific methods."
        },
        {
          front: "What practical applications emerge from this scientific knowledge?",
          back: "Applications include technological innovations, problem-solving methods, and improvements to existing systems or processes based on scientific understanding."
        }
      ]
    };
  } else if (isHistory) {
    // Provide history-focused fallback content
    return {
      summaryPoints: [
        "The content explores significant historical events and their contexts.",
        "Key historical figures and their contributions are discussed.",
        "Social, political, and economic factors of the period are analyzed.",
        "The causes and consequences of historical developments are examined.",
        "The historical narrative is placed within broader historical patterns and trends."
      ],
      // ... similar patterns for questions, quizQuestions, and flashcards
      questions: [
        "What were the key events discussed in this historical period?",
        "How did social and political factors influence these historical developments?",
        "What role did key individuals play in shaping these historical events?",
        "How did this historical period affect subsequent developments?",
        "What patterns or trends can be identified in this historical context?"
      ],
      quizQuestions: [
        {
          question: "Which factor most significantly influenced this historical development?",
          options: [
            "Economic conditions",
            "Political leadership",
            "Social movements",
            "Technological changes"
          ],
          correctAnswerIndex: 1
        },
        {
          question: "What was the primary consequence of these historical events?",
          options: [
            "Political reorganization",
            "Social transformation",
            "Economic growth",
            "Cultural renaissance"
          ],
          correctAnswerIndex: 0
        },
        {
          question: "How did this historical period compare to previous eras?",
          options: [
            "It represented a radical break from the past",
            "It continued established trends",
            "It revived earlier patterns",
            "It synthesized elements from multiple previous periods"
          ],
          correctAnswerIndex: 3
        }
      ],
      flashcards: [
        {
          front: "What were the defining characteristics of this historical period?",
          back: "The period was characterized by specific political structures, social organizations, economic systems, and cultural expressions that distinguished it from other eras."
        },
        {
          front: "Who were the key figures in this historical context?",
          back: "Important individuals included political leaders, social reformers, cultural innovators, and other figures who significantly influenced the course of events."
        },
        {
          front: "How did this historical development impact later periods?",
          back: "The legacy included lasting institutions, ideological frameworks, social patterns, or precedents that continued to shape subsequent historical developments."
        }
      ]
    };
  } else if (isMath) {
    // Provide math-focused fallback content
    return {
      summaryPoints: [
        "The content explains key mathematical concepts and formulas.",
        "Theoretical foundations and principles are presented systematically.",
        "Problem-solving approaches and techniques are demonstrated.",
        "Applications of mathematical methods to practical situations are explored.",
        "Relationships between different mathematical concepts are clarified."
      ],
      // ... similar patterns for questions, quizQuestions, and flashcards
      questions: [
        "What are the fundamental mathematical principles presented in the content?",
        "How are these mathematical concepts applied to solve problems?",
        "What is the relationship between the different mathematical formulas discussed?",
        "How can these mathematical methods be used in real-world situations?",
        "What are the limitations or constraints of these mathematical approaches?"
      ],
      quizQuestions: [
        {
          question: "Which mathematical property is essential to solving the problems described?",
          options: [
            "Commutative property",
            "Associative property",
            "Distributive property",
            "Transitive property"
          ],
          correctAnswerIndex: 2
        },
        {
          question: "What is the correct approach to solving this type of mathematical problem?",
          options: [
            "Direct substitution",
            "Step-by-step simplification",
            "Application of a specific formula",
            "Graphical analysis"
          ],
          correctAnswerIndex: 1
        },
        {
          question: "How does this mathematical concept connect to other areas of mathematics?",
          options: [
            "It forms a foundation for more advanced concepts",
            "It provides tools for solving other types of problems",
            "It demonstrates principles that apply broadly",
            "All of the above"
          ],
          correctAnswerIndex: 3
        }
      ],
      flashcards: [
        {
          front: "What is the key formula presented in this material?",
          back: "The formula represents a fundamental mathematical relationship that allows for calculation, prediction, or analysis within the specific context."
        },
        {
          front: "How do you approach solving problems using these mathematical methods?",
          back: "Problem-solving involves identifying the appropriate formula or approach, organizing the given information, applying the mathematical procedure, and interpreting the results."
        },
        {
          front: "What real-world applications utilize this mathematical concept?",
          back: "Applications include practical scenarios where these mathematical principles are used to model, predict, optimize, or understand real-world phenomena."
        }
      ]
    };
  } else {
    // General fallback content for other subjects
    return {
      summaryPoints: [
        "The content presents key concepts and principles on the topic.",
        "Important relationships and patterns are identified and explained.",
        "Methodologies and approaches for understanding the subject are outlined.",
        "Practical applications and implications are discussed.",
        "Current understanding and potential developments are considered."
      ],
      questions: [
        "What are the main concepts discussed in the content?",
        "How do these concepts relate to one another?",
        "What methodologies are used in this field?",
        "How is this knowledge applied in practical settings?",
        "What are the implications of these ideas?"
      ],
      quizQuestions: [
        {
          question: "What is the central theme of this content?",
          options: [
            "Theoretical frameworks",
            "Practical applications",
            "Historical development",
            "Current challenges"
          ],
          correctAnswerIndex: 0
        },
        {
          question: "Which approach is most emphasized in the material?",
          options: [
            "Analytical thinking",
            "Creative problem-solving",
            "Systematic methodology",
            "Critical evaluation"
          ],
          correctAnswerIndex: 2
        },
        {
          question: "How would you best categorize this content?",
          options: [
            "Foundational knowledge",
            "Advanced theory",
            "Practical guide",
            "Comparative analysis"
          ],
          correctAnswerIndex: 0
        }
      ],
      flashcards: [
        {
          front: "What are the key principles covered in this material?",
          back: "The key principles include fundamental concepts, established frameworks, and methodological approaches that form the foundation of understanding in this area."
        },
        {
          front: "How is knowledge in this field organized and structured?",
          back: "Knowledge is organized through conceptual frameworks, categorical systems, relationship patterns, and methodological approaches specific to the field."
        },
        {
          front: "What practical applications emerge from this knowledge?",
          back: "Applications include problem-solving approaches, decision-making frameworks, implementation strategies, and practical tools derived from theoretical understanding."
        }
      ]
    };
  }
};
