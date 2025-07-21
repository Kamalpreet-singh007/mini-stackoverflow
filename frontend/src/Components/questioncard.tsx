import { useNavigate } from 'react-router-dom';
import React from 'react';
import type { Question } from '../types';
import '../Css/questioncard.css';
import { formatDistanceToNow } from 'date-fns';

type Props = {
  question: Question;
};
export const QuestionCard: React.FC<Props> = ({ question }) => {
  const navigate = useNavigate();

  const maxChars = 300;
  const shortBody =
    question.body.length > maxChars
      ? question.body.slice(0, maxChars) + '...'
      : question.body;

  const showDescription = () => {
    navigate(`/question/${question.id}`);
  };

  return (
    <div className="questionCard">
      <div className="questionCard-stat">
        <p className="questionCard-upvotes">{question.upvote_count} upvotes</p>
        <p className="questioncard-answers  ">
          {question.response_count} answers
        </p>
      </div>
      <div className="questionCard-content">
        <p className="questionCard-title" onClick={showDescription}>
          {question.title}
        </p>
        <p className="questioncard-body">{shortBody}</p>
        <div className="questionCard_footer">
          <div className="meta">
            <span>~ {question.author.username}</span>
            <span className="descriptionPage-date">
              {question.updated_at !== question.created_at ? (
                <>
                  {' '}
                  Modified{' '}
                  {formatDistanceToNow(new Date(question.updated_at), {
                    addSuffix: true,
                  })}
                </>
              ) : (
                <>
                  {' '}
                  Asked{' '}
                  {formatDistanceToNow(new Date(question.created_at), {
                    addSuffix: true,
                  })}
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
