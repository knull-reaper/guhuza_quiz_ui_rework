import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '../hooks/useQuizAPI';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answerIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: number;
  showResult?: boolean;
  disabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  showResult = false,
  disabled = false
}) => {
  const getButtonVariant = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? 'default' : 'outline';
    }
    
    if (index === question.correct) {
      return 'default'; // Correct answer
    }
    
    if (selectedAnswer === index && index !== question.correct) {
      return 'destructive'; // Wrong selected answer
    }
    
    return 'outline';
  };

  const getButtonClassName = (index: number) => {
    if (!showResult) return '';
    
    if (index === question.correct) {
      return 'bg-success hover:bg-success text-success-foreground';
    }
    
    if (selectedAnswer === index && index !== question.correct) {
      return 'bg-destructive hover:bg-destructive';
    }
    
    return '';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground">
            Level {question.level}
          </span>
        </div>
        <CardTitle className="text-xl leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.answers.map((answer, index) => (
            <Button
              key={index}
              variant={getButtonVariant(index)}
              className={`w-full text-left justify-start h-auto p-4 text-wrap ${getButtonClassName(index)}`}
              onClick={() => !disabled && onAnswer(index)}
              disabled={disabled}
            >
              <span className="font-semibold mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              {answer}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};