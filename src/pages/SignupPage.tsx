import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ArrowRight, Sparkles, Trophy, Target } from 'lucide-react';
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
        title: "Welcome to QuizMaster!",
        description: `Your adventure begins now, ${username}!`,
      });
      
      navigate('/profile');
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
      
      <div className="w-full max-w-md relative">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl mb-6 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            Welcome to QuizMaster
          </h1>
          <p className="text-muted-foreground text-lg">
            Test your knowledge across multiple levels and compete with players worldwide
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
            <Trophy className="h-6 w-6 text-primary mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground">Achievements</p>
          </div>
          <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
            <Target className="h-6 w-6 text-accent mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground">10 Levels</p>
          </div>
          <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
            <User className="h-6 w-6 text-success mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground">Leaderboard</p>
          </div>
        </div>

        {/* Signup Card */}
        <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/90">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">Create Your Profile</CardTitle>
            <p className="text-muted-foreground">Choose a username to start your quiz journey</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-base font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  autoFocus
                  className="h-12 text-base border-2 focus:border-primary"
                />
                <p className="text-sm text-muted-foreground">
                  Choose a unique username (3-20 characters)
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg" 
                disabled={loading || !username.trim()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Setting up your profile...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Start Your Quiz Adventure
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Ready to challenge your mind? Let's see what you know! 🧠✨
          </p>
        </div>
      </div>
    </div>
  );
};