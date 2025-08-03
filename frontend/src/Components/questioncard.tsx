import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useContext } from 'react';

import type { Question } from '../types';
import '../Css/questioncard.css';
import { formatDistanceToNow } from 'date-fns';
import { AuthContext } from '../utills/auth';
import { QuestionContext } from '../utills/question';

type Props = {
  question: Question;
};
export const QuestionCard: React.FC<Props> = ({ question }) => {
  const maxChars = 300;
  const shortBody =
    question.body.length > maxChars
      ? question.body.slice(0, maxChars) + '...'
      : question.body;

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      'useContext(QuestionContext) returned null — did you forget to wrap a provider?'
    );
  }
  const { user } = authContext;
  const questionContext = useContext(QuestionContext);
  if (!questionContext) {
    throw new Error(
      'useContext(QuestionContext) returned null — did you forget to wrap a provider?'
    );
  }
  const { deleteQuestion_ } = questionContext;

  const showDescription = () => {
    navigate(`/question/${question.id}`);
  };

  const handelUpdate = async () => {
    navigate(`/update/question/${question.id}`);
  };
  const deleteQuestion = async () => {
    deleteQuestion_(question.id);
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
        {question.author.id === user?.id && (
          <div className="questionCard_privlages">
            <button className="delete" onClick={deleteQuestion}>
              delete
            </button>
            <button className="update" onClick={handelUpdate}>
              update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
