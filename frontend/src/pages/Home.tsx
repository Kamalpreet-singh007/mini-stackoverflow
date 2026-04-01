import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionContext } from '../contexts/question';
import type { Question } from '../types';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Clock, MessageSquare } from 'lucide-react';

function Home() {
  const context = useContext(QuestionContext);
  if (!context) throw new Error('QuestionContext is null');
  const { getquestions, setquestions, questions } = context;

  useEffect(() => {
    getquestions();
  }, []);

  const sortNewest = () => {
    setquestions([...questions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  };
  const sortMostResponses = () => {
    setquestions([...questions].sort((a, b) => b.response_count - a.response_count));
  };
  const sortMostUpvoted = () => {
    setquestions([...questions].sort((a, b) => b.upvote_count - a.upvote_count));
  };

  return (
    <div className="flex flex-col h-full w-full mt-2">

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button onClick={sortNewest} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <Clock className="h-3 w-3" /> Newest
          </button>
          <button onClick={sortMostResponses} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <MessageSquare className="h-3 w-3" /> Most Responses
          </button>
          <button onClick={sortMostUpvoted} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <TrendingUp className="h-3 w-3" /> Most Upvoted
          </button>
        </div>

        {/* Questions — single column full-width */}
        <div className="flex flex-col gap-4">
          {(questions ?? []).map((q: Question) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No questions yet. Be the first to ask!</p>
          </div>
        )}
    </div>
  );
}

export default Home;
