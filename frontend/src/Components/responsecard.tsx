import type { CommentDescription, Response } from '../types';
import '../Css/responsecard.css';
import { formatDistanceToNow, set } from 'date-fns';
import { useState, useContext, useEffect } from 'react';

import React from 'react';
import { QuestionContext } from '../utills/question';
type Props = {
  response: Response;
  onUpdate: (updated: Response) => void;
};
export const ResponseCard: React.FC<Props> = ({ response, onUpdate }) => {
  const [body, setBody] = useState(response.body);
  const [viewmore, setViewmore] = useState(false);
  const [liked, setLiked] = useState(response.upvoted_by_user);
  const [likeCount, setLikeCount] = useState(response.upvote_count);
  const [commentCount, setCommentCount] = useState(response.comment_count ?? 0);
  const [showCommentDropDown, setShowCommentDropdown] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const context = useContext(QuestionContext)!;
  if (!context) {
    throw new Error(
      'useContext(QuestionContext) returned null — did you forget to wrap a provider?'
    );
  }
  const { postComment, getComments, upvote, downvote, getResponseById } =
    context;

  const [comments, setComments] = useState<CommentDescription[]>([]);

  const bodyIsShort = response.body.length <= 200;

  useEffect(() => {
    setBody(bodyIsShort ? response.body : response.body.slice(0, 200) + '...');
  }, [response.body]);

  const showComment = async () => {
    const result = await getComments(response.id);
    setComments(result || []);
    setShowCommentDropdown(!showCommentDropDown);
  };

  const handleViewMore = () => {
    setViewmore((prev) => {
      const nextViewMore = !prev;
      setBody(
        nextViewMore
          ? response.body // full
          : !bodyIsShort
          ? response.body.slice(0, 200) + '...' // truncated
          : response.body
      );
      return nextViewMore;
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
    const optimisticCount = likeCount + (optimisticLiked ? 1 : -1);
    setLiked(optimisticLiked);
    setLikeCount(optimisticCount);
    setLiked(optimisticLiked);
    setLikeCount(optimisticCount);
    try {
      if (optimisticLiked) {
        await upvote(response.id, 'response');
      } else {
        await downvote(response.id, 'response');
      }
      const updated = await getResponseById(response.id);
      onUpdate(updated);
    } catch (error) {
      console.error('Failed to update like:', error);
      setLiked(prevLiked);
      setLikeCount(prevLikeCount);
    }
  };

  const postCommentHandeler = async () => {
    if (!localStorage.getItem('access_token')) {
      alert('Please login to post a comment.');
      return;
    }
    if (!commentInput.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    const prevCommentCount = commentCount;
    const optimistic_count = commentCount + 1;
    setCommentCount(optimistic_count);
    setShowCommentDropdown(true);
    try {
      const newComment = await postComment(response.id, commentInput);
      console.log('New comment posted:', newComment);
      if (newComment) {
        setComments((prev) => [...prev, newComment]);
      }
      const updated = await getResponseById(response.id);

      onUpdate(updated);
      setCommentInput('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Failed to post comment. Please try again.');
      setCommentCount(prevCommentCount);
      return;
    }
  };

  return (
    <div className="responseCard">
      <div className="meta">
        <div className="meta-author">@ {response.author.username}</div>
        <div className="date">
          {response.updated_at !== response.created_at ? (
            <>
              Modified{' '}
              {formatDistanceToNow(new Date(response.updated_at), {
                addSuffix: true,
              })}
            </>
          ) : (
            <>
              Asked{' '}
              {formatDistanceToNow(new Date(response.created_at), {
                addSuffix: true,
              })}
            </>
          )}
        </div>
      </div>
      <div className="response-body">{body}</div>

      {!bodyIsShort && (
        <div className="viewMore" onClick={handleViewMore}>
          {viewmore ? 'View more' : 'View less'}
        </div>
      )}
      <div className="footer">
        <div className="footer-upvote" onClick={likeResponse}>
          {likeCount}👍
        </div>
        <div className="footer-comment" onClick={showComment}>
          💬{commentCount}
        </div>
        {showCommentDropDown && (
          <div className="comment-dropdown">
            <div className="comments-list">
              {comments?.map((c, i) => (
                <div key={i} className="comment">
                  {c.body}
                </div>
              ))}
            </div>
            <div className="comment-input">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
              />
              <button onClick={postCommentHandeler}>Post</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
