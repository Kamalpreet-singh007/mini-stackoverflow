import type { CommentDescription, Response } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useState, useContext, useEffect } from 'react';
import { QuestionContext } from '../contexts/question';
import { ThumbsUp, MessageCircle, ChevronDown, ChevronUp, Send, CornerDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  response: Response;
  onUpdate: (updated: Response) => void;
};

// Recursive nested comment component
const CommentThread: React.FC<{ comment: CommentDescription; depth?: number }> = ({ comment, depth = 0 }) => {
  const maxIndent = 4;
  const indent = Math.min(depth, maxIndent);

  return (
    <div style={{ marginLeft: indent > 0 ? `${indent * 20}px` : 0 }}>
      <div className={`rounded-lg px-3 py-2.5 mb-2 ${depth > 0 ? 'border-l-2 border-primary/20 bg-secondary/30' : 'bg-secondary/50'}`}>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
            {comment.author.username[0].toUpperCase()}
          </div>
          <span className="text-xs font-medium text-foreground">{comment.author.username}</span>
          <span className="text-xs text-muted-foreground">
            · {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground pl-6">{comment.body}</p>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="animate-fade-in">
          {comment.replies.map((reply) => (
            <CommentThread key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ResponseCard: React.FC<Props> = ({ response, onUpdate }) => {
  const [body, setBody] = useState(response.body);
  const [viewmore, setViewmore] = useState(false);
  const [liked, setLiked] = useState(response.upvoted_by_user);
  const [likeCount, setLikeCount] = useState(response.upvote_count);
  const [commentCount, setCommentCount] = useState(response.comment_count ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<CommentDescription[]>([]);

  const context = useContext(QuestionContext)!;
  if (!context) throw new Error('QuestionContext is null');
  const { postComment, getComments, upvote, downvote, getResponseById } = context;

  const bodyIsShort = response.body.length <= 200;

  useEffect(() => {
    setBody(bodyIsShort ? response.body : response.body.slice(0, 200) + '...');
  }, [response.body, bodyIsShort]);

  const toggleComments = async () => {
    if (!showComments) {
      const result = await getComments(response.id);
      setComments(result || []);
    }
    setShowComments(!showComments);
  };

  const handleViewMore = () => {
    setViewmore((prev) => {
      const next = !prev;
      setBody(next ? response.body : bodyIsShort ? response.body : response.body.slice(0, 200) + '...');
      return next;
    });
  };

  const likeResponse = async () => {
    if (!localStorage.getItem('access_token')) {
      alert('Please login to like this response.');
      return;
    }
    const prevLiked = liked;
    const prevLikeCount = likeCount;
    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setLikeCount(likeCount + (optimisticLiked ? 1 : -1));
    try {
      if (optimisticLiked) await upvote(response.id, 'response');
      else await downvote(response.id, 'response');
      const updated = await getResponseById(response.id);
      onUpdate(updated);
    } catch (error) {
      console.error('Failed to update like:', error);
      setLiked(prevLiked);
      setLikeCount(prevLikeCount);
    }
  };

  const postCommentHandler = async () => {
    if (!localStorage.getItem('access_token')) { alert('Please login to comment.'); return; }
    if (!commentInput.trim()) return;
    const prevCount = commentCount;
    setCommentCount(commentCount + 1);
    try {
      const newComment = await postComment(response.id, commentInput);
      if (newComment) setComments((prev) => [...prev, newComment]);
      const updated = await getResponseById(response.id);
      onUpdate(updated);
      setCommentInput('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      setCommentCount(prevCount);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 mb-4 animate-fade-in">
      {/* Author & Date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            {response.author.username[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-foreground">{response.author.username}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {response.updated_at !== response.created_at
            ? `Modified ${formatDistanceToNow(new Date(response.updated_at), { addSuffix: true })}`
            : formatDistanceToNow(new Date(response.created_at), { addSuffix: true })}
        </span>
      </div>

      {/* Body */}
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{body}</p>
      {!bodyIsShort && (
        <button onClick={handleViewMore} className="mt-1 text-xs font-medium text-primary hover:underline">
          {viewmore ? 'Show less' : 'Show more'}
        </button>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
        <button
          onClick={likeResponse}
          className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
            liked ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
          }`}
          aria-label={liked ? 'Unlike response' : 'Like response'}
        >
          <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-primary' : ''}`} /> {likeCount}
        </button>
        <button
          onClick={toggleComments}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Toggle comments"
        >
          <MessageCircle className="h-4 w-4" /> {commentCount}
          {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Threaded Comments */}
      {showComments && (
        <div className="mt-3 border-t border-border pt-3 animate-fade-in">
          {comments.length > 0 && (
            <div className="space-y-1 mb-3">
              {comments.map((c) => (
                <CommentThread key={c.id} comment={c} depth={0} />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <CornerDownRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && postCommentHandler()}
              aria-label="Add a comment"
            />
            <Button size="sm" onClick={postCommentHandler} className="h-9 w-9 p-0 rounded-full" aria-label="Submit comment">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
