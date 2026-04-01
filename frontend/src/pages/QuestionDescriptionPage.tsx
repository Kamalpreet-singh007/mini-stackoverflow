import { QuestionContext } from '../contexts/question';
import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Question, Response } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ResponseCard } from '../components/ResponseCard';
import { Button } from '@/components/ui/button';
import { ArrowUp, Send } from 'lucide-react';

const QuestionDescriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const questionid = id;
  const [responses, setResponses] = useState<Response[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>();

  const questionContext = useContext(QuestionContext);
  if (!questionContext) throw new Error('QuestionContext is null');
  const { getResponses, postResponse, upvote, downvote, getQuestionbyId } = questionContext;

  useEffect(() => {
    setLoading(true);
    const getQuestion = async () => {
      const questiondata = await getQuestionbyId(Number(questionid));
      setCurrentQuestion(questiondata);
      setUpvoted(questiondata?.upvoted_by_user || false);
      setUpvoteCount(questiondata?.upvote_count || 0);
      setLoading(false);
    };
    getQuestion();
  }, [questionid, getQuestionbyId]);

  useEffect(() => {
    const fetchResponses = async () => {
      const result = await getResponses(Number(questionid));
      setResponses(result);
    };
    fetchResponses();
  }, [questionid, getResponses]);

  const updateResponse = (updated: Response) => {
    setResponses((prev) => prev.map((res) => (res.id === updated.id ? updated : res)));
  };

  const handlePostResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    await postResponse(currentQuestion!.id, body);
    setBody('');
    const result = await getResponses(Number(questionid));
    setResponses(result);
  };

  const handleUpvote = async () => {
    if (!localStorage.getItem('access_token')) {
      alert('Please login to upvote.');
      return;
    }
    const prevLiked = upvoted;
    const prevCount = upvoteCount;
    const optimisticLiked = !upvoted;
    setUpvoted(optimisticLiked);
    setUpvoteCount(upvoteCount + (optimisticLiked ? 1 : -1));
    try {
      if (optimisticLiked) await upvote(currentQuestion!.id, 'question');
      else await downvote(currentQuestion!.id, 'question');
    } catch (error) {
      setUpvoted(prevLiked);
      setUpvoteCount(prevCount);
    }
  };

  if (loading || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Glassmorphism Question Card */}
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-lg mb-8 animate-fade-in">
          <div className="flex gap-5">
            {/* Vote sidebar */}
            <div className="flex flex-col items-center gap-1.5 pt-1">
              <button
                onClick={handleUpvote}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all ${
                  upvoted
                    ? 'border-primary bg-primary/15 text-primary shadow-md shadow-primary/20'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
                aria-label={upvoted ? 'Remove upvote' : 'Upvote this question'}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <span className={`text-lg font-bold ${upvoted ? 'text-primary' : 'text-foreground'}`}>
                {upvoteCount}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                {currentQuestion.title}
              </h1>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap mb-4">
                {currentQuestion.body}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                    {currentQuestion.author?.username[0].toUpperCase()}
                  </div>
                  <span className="font-medium">{currentQuestion.author?.username}</span>
                </div>
                <span>
                  {currentQuestion.updated_at !== currentQuestion.created_at
                    ? `Modified ${formatDistanceToNow(new Date(currentQuestion.updated_at), { addSuffix: true })}`
                    : `Asked ${formatDistanceToNow(new Date(currentQuestion.created_at), { addSuffix: true })}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Responses */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {responses.length} {responses.length === 1 ? 'Response' : 'Responses'}
          </h2>
          {responses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No responses yet. Be the first to reply!</p>
          ) : (
            responses.map((res) => (
              <ResponseCard key={res.id} response={res} onUpdate={updateResponse} />
            ))
          )}
        </div>

        {/* Post Response */}
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Response</h2>
          <form onSubmit={handlePostResponse} className="space-y-4">
            <textarea
              placeholder="Write your response..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={5}
              className="w-full rounded-xl border border-input bg-background/60 backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
            />
            <Button type="submit" className="gap-2 rounded-full">
              <Send className="h-4 w-4" /> Submit Response
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionDescriptionPage;
