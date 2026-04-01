import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import type { Question } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { AuthContext } from '../contexts/auth';
import { QuestionContext } from '../contexts/question';
import { ArrowUp, MessageSquare, Trash2, Pencil } from 'lucide-react';

type Props = {
  question: Question;
};

export const QuestionCard: React.FC<Props> = ({ question }) => {
  const maxChars = 200;
  const shortBody =
    question.body.length > maxChars
      ? question.body.slice(0, maxChars) + '...'
      : question.body;

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext is null');
  const { user } = authContext;

  const questionContext = useContext(QuestionContext);
  if (!questionContext) throw new Error('QuestionContext is null');
  const { deleteQuestion_ } = questionContext;

  return (
    <div
      className="group w-full rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 transition-all hover:shadow-md hover:border-primary/30 cursor-pointer animate-fade-in"
      onClick={() => navigate(`/question/${question.id}`)}
    >
      <div className="flex gap-4">
        {/* Stats sidebar */}
        <div className="hidden sm:flex flex-col items-center gap-2 min-w-[48px] pt-1">
          <div className="flex flex-col items-center rounded-lg bg-primary/10 px-2 py-1.5">
            <ArrowUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">{question.upvote_count}</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-accent/10 px-2 py-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold text-accent">{question.response_count}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
            {question.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{shortBody}</p>

          {/* Mobile stats */}
          <div className="flex sm:hidden items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1 text-xs text-primary">
              <ArrowUp className="h-3 w-3" /> {question.upvote_count}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-accent">
              <MessageSquare className="h-3 w-3" /> {question.response_count}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
                {question.author.username[0].toUpperCase()}
              </div>
              <span>{question.author.username}</span>
            </div>
            <span>
              {question.updated_at !== question.created_at
                ? `Modified ${formatDistanceToNow(new Date(question.updated_at), { addSuffix: true })}`
                : `Asked ${formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}`}
            </span>
          </div>

          {/* Owner actions */}
          {question.author.id === user?.id && (
            <div className="mt-3 flex gap-2 border-t border-border pt-3">
              <button
                onClick={(e) => { e.stopPropagation(); deleteQuestion_(question.id); }}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/update/question/${question.id}`); }}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
