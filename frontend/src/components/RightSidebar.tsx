import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QuestionContext } from '../contexts/question';
import { AuthContext } from '../contexts/auth';
import { Flame, MessageCircle, ArrowUp, Code2, Users, FileQuestion, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RightSidebar() {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const questionContext = useContext(QuestionContext);

  if (!authContext || !questionContext) return null;

  const { isAuth } = authContext;
  const { questions } = questionContext;

  // Hide right sidebar on specific pages where focus is needed
  const hiddenPaths = ['/', '/login', '/ask'];
  if (hiddenPaths.includes(location.pathname) || location.pathname.startsWith('/update/')) {
    return null;
  }

  // Calculate trending questions (top 5 by upvotes)
  const trendingQuestions = [...(questions || [])]
    .sort((a, b) => b.upvote_count - a.upvote_count)
    .slice(0, 5);

  return (
    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 gap-6 sticky top-[5.5rem] h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-4 scrollbar-thin">
      
      {/* Ask a Question Card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col shrink-0">
        <div className="h-24 bg-gradient-to-br from-primary to-orange-600 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
              <FileQuestion className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-white text-lg drop-shadow-sm">Have a Question?</h3>
          </div>
        </div>
        
        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The best way to get help is to ask! Join thousands of developers and get your problem solved.
          </p>
          
          {isAuth ? (
            <Link to="/ask" className="block w-full">
              <Button className="w-full gap-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all active:scale-95">
                <Plus className="h-4 w-4" /> Ask Now
              </Button>
            </Link>
          ) : (
            <Link to="/login" className="block w-full">
              <Button variant="outline" className="w-full rounded-full border-primary/50 text-primary hover:bg-primary/5 transition-all">
                Sign In to Ask
              </Button>
            </Link>
          )}
          
          <div className="flex items-center justify-center gap-4 pt-2 border-t border-border/50">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-foreground">100%</span>
              <span className="text-[10px] text-muted-foreground uppercase">Response</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-foreground">~5min</span>
              <span className="text-[10px] text-muted-foreground uppercase">Avg Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-4 shrink-0">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" /> Stack Stats
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <FileQuestion className="h-4 w-4" /> Total Questions
            </span>
            <span className="font-semibold text-foreground">{questions?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4" /> Total Answers
            </span>
            <span className="font-semibold text-foreground">
              {questions?.reduce((acc, q) => acc + q.response_count, 0) || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" /> Developers
            </span>
            <span className="font-semibold text-foreground">1K+</span>
          </div>
        </div>
      </div>

      {/* Trending Questions */}
      {trendingQuestions.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-sm p-4 shrink-0">
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500/20" /> Hot Discussions
          </h3>
          <div className="flex flex-col gap-4">
            {trendingQuestions.map((q) => (
              <Link
                key={q.id}
                to={`/question/${q.id}`}
                className="group flex flex-col gap-1.5"
              >
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {q.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium bg-secondary/80 px-1.5 py-0.5 rounded-md">
                    <ArrowUp className="h-3 w-3 text-primary" /> {q.upvote_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {q.response_count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
}
