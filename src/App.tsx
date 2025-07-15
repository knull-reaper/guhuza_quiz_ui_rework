import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { SignupPage } from "./pages/SignupPage";
import { QuizPage } from "./pages/QuizPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignupPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/quiz/:level" element={<QuizPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
