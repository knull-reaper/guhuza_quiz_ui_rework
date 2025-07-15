import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { QuestionCard } from '../components/QuestionCard';
import { Timer } from '../components/Timer';
import { useQuizAPI } from '../hooks/useQuizAPI';
import { useSubmitQuiz } from '../hooks/useSubmitQuiz';
import { useUser } from '../context/UserContext';
import { useToast } from '../hooks/use-toast';

export const QuizPage: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const { username } = useUser();
  const { toast } = useToast();
  
  const currentLevel = parseInt(level || '1', 10);
  const { questions, loading, error } = useQuizAPI(currentLevel);
  const { submitQuiz, submitting } = useSubmitQuiz();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [answers, setAnswers] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const [quizState, setQuizState] = useState<'playing' | 'finished' | 'submitting'>('playing');
  const [showResult, setShowResult] = useState(false);
  const [newAwards, setNewAwards] = useState<{ achievements: any[]; badges: any[] }>({ achievements: [], badges: [] });

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Redirect if no username
  useEffect(() => {
    if (!username) {
      navigate('/signup');
    }
  }, [username, navigate]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (selectedAnswer !== undefined) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const questionTime = (Date.now() - questionStartTime) / 1000;
    setTotalTime(prev => prev + questionTime);
    
    setTimeout(() => {
      const newAnswers = [...answers, answerIndex];
      setAnswers(newAnswers);
      
      if (isLastQuestion) {
        finishQuiz(newAnswers);
      } else {
        nextQuestion();
      }
    }, 1500);
  }, [selectedAnswer, questionStartTime, answers, isLastQuestion]);

  const handleTimeUp = useCallback(() => {
    if (selectedAnswer !== undefined) return;
    handleAnswer(-1); // -1 indicates timeout
  }, [selectedAnswer, handleAnswer]);

  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(undefined);
    setShowResult(false);
    setQuestionStartTime(Date.now());
  };

  const finishQuiz = async (finalAnswers: number[]) => {
    setQuizState('submitting');
    
    const correctCount = finalAnswers.reduce((count, answer, index) => {
      return answer === questions[index]?.correct ? count + 1 : count;
    }, 0);

    try {
      const result = await submitQuiz({
        level: currentLevel,
        correctCount,
        totalTime: Math.round(totalTime)
      });

      if (result.success) {
        setNewAwards(result.awarded);
        toast({
          title: "Quiz completed!",
          description: `You scored ${correctCount}/${questions.length} in ${Math.round(totalTime)}s`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz results",
        variant: "destructive"
      });
    }
    
    setQuizState('finished');
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setAnswers([]);
    setTotalTime(0);
    setQuizState('playing');
    setShowResult(false);
    setQuestionStartTime(Date.now());
    setNewAwards({ achievements: [], badges: [] });
  };

  const handleNextLevel = () => {
    navigate(`/quiz/${currentLevel + 1}`);
  };

  if (!username) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <XCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">Failed to load quiz</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === 'finished') {
    const correctCount = answers.reduce((count, answer, index) => {
      return answer === questions[index]?.correct ? count + 1 : count;
    }, 0);

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Trophy className="h-6 w-6 text-primary" />
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {correctCount}/{questions.length}
              </div>
              <p className="text-muted-foreground">
                Completed in {Math.round(totalTime)} seconds
              </p>
            </div>

            {newAwards.achievements.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  New Achievements!
                </h3>
                {newAwards.achievements.map((achievement: any) => (
                  <div key={achievement.id} className="text-sm text-muted-foreground">
                    🏆 {achievement.name}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRetry} className="flex-1">
                Retry Level {currentLevel}
              </Button>
              <Button onClick={handleNextLevel} className="flex-1">
                Level {currentLevel + 1}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/leaderboard')} className="flex-1">
                View Leaderboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/profile')} className="flex-1">
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Level {currentLevel}</h1>
            <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome, {username}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-2" />
        </div>

        {/* Timer */}
        <div className="mb-6">
          <Timer
            duration={30}
            onTimeUp={handleTimeUp}
            isActive={quizState === 'playing' && !showResult}
          />
        </div>

        {/* Question */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            disabled={showResult || quizState !== 'playing'}
          />
        )}
      </div>
    </div>
  );
};