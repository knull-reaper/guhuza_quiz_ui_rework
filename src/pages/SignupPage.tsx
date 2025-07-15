import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useToast } from '../hooks/use-toast';

export const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUsername: setUserContextUsername } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue.",
        variant: "destructive"
      });
      return;
    }

    if (username.length < 3) {
      toast({
        title: "Username too short",
        description: "Username must be at least 3 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUserContextUsername(username.trim());
      
      toast({
        title: "Welcome!",
        description: `Welcome to QuizMaster, ${username}!`,
      });
      
      navigate('/quiz/1');
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to QuizMaster</h1>
          <p className="text-muted-foreground">
            Enter your username to start your quiz journey
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Choose a unique username (3-20 characters)
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !username.trim()}
              >
                {loading ? (
                  "Setting up..."
                ) : (
                  <>
                    Start Quiz Adventure
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Ready to test your knowledge across multiple levels?
        </div>
      </div>
    </div>
  );
};