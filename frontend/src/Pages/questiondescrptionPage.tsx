import { QuestionContext } from '../utills/question';
import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Question, Response } from '../types';
import '../Css/questiondescriptionpage.css';
import { formatDistanceToNow, set } from 'date-fns';
import { ResponseCard } from '../Components/responsecard';

export const QuestionDescriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const questionid = id;
  const [responses, setResponses] = useState<Response[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<
    Question | undefined
  >();

  const questionContext = useContext(QuestionContext);
  if (!questionContext) {
    throw new Error(
      'useContext(QuestionContext) returned null — did you forget to wrap a provider?'
    );
  }
  const { getResponses, postResponse, upvote, downvote, getQuestionbyId } =
    questionContext;

  useEffect(() => {
    setLoading(true);
    const getQuestion = async () => {
      const questiondata = await getQuestionbyId(Number(questionid));
      setCurrentQuestion(questiondata);
      console.log('questiondata', questiondata);
      setUpvoted(questiondata?.upvoted_by_user || false);
      setUpvoteCount(questiondata?.upvote_count || 0);
      console.log('upvoted', questiondata?.upvoted_by_user);
      console.log('upvoteCount', questiondata?.upvote_count);
      setLoading(false);
    };
    getQuestion();
  }, [questionid, getQuestionbyId]);
  useEffect(() => {
    setLoading(true);
    try {
      const fetchQuestionDescription = async () => {
        const result = await getResponses(Number(questionid));
        setResponses(result);
      };
      fetchQuestionDescription();
    } catch (err) {
      console.error('Failed to load question:', err);
    } finally {
      setLoading(false);
    }
  }, [questionid, getResponses]);

  if (loading || !currentQuestion) {
    return <div>Loading question...</div>;
  }
  const updateResponse = (updated: Response) => {
    setResponses((prevResponses) =>
      prevResponses.map((res) => (res.id === updated.id ? updated : res))
    );
  };

  const handelpost = async (e: React.FormEvent) => {
    e.preventDefault();
    await postResponse(currentQuestion.id, body);
    setBody('');
  };

  const handleUpvote = async () => {
    if (!localStorage.getItem('access_token')) {
      alert('Please login to like this response.');
      return;
    }
    const prevLikeCount = currentQuestion.upvote_count;
    const prevLiked = currentQuestion.upvoted_by_user;
    // console.log('prevLiked', prevLiked);
    const optimisticLiked = !upvoted;
    const optimisticCount = upvoteCount + (optimisticLiked ? 1 : -1);
    setUpvoted(optimisticLiked);
    setUpvoteCount(optimisticCount);
    try {
      if (optimisticLiked) {
        await upvote(currentQuestion.id, 'question');
      } else {
        await downvote(currentQuestion.id, 'question');
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      setUpvoted(prevLiked);
      setUpvoteCount(prevLikeCount);
    }
  };
  return (
    <div className="descriptionPage">
      <div className="descriptionPage-content">
        <div className="descriptionPage-mainline">
          <div className="descriptionPage-question-upvote">
            <button
              className={`upvote-btn ${upvoted ? 'upvoted' : ''}`}
              onClick={handleUpvote}
            >
              ▲
            </button>
            <div className="upvote-count">{upvoteCount}</div>
          </div>
          <div className="descriptionPage-question">
            <h1 className="descriptionPage-title">{currentQuestion?.title}</h1>

            <p className="descriptionPage-body">{currentQuestion?.body}</p>

            <div className="descriptionPage-author">
              <p className="descriptionPage-author-name">
                {' '}
                ~{currentQuestion?.author?.username}
              </p>
              <p className="descriptionPage-date">
                {currentQuestion.updated_at !== currentQuestion.created_at ? (
                  <>
                    Modified{' '}
                    {formatDistanceToNow(new Date(currentQuestion.updated_at), {
                      addSuffix: true,
                    })}
                  </>
                ) : (
                  <>
                    Asked{' '}
                    {formatDistanceToNow(new Date(currentQuestion.created_at), {
                      addSuffix: true,
                    })}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="descriptionPage-responses">
          <h2>Responses</h2>
          {responses.map((res) => (
            <ResponseCard
              key={res.id}
              response={res}
              onUpdate={updateResponse}
            />
          ))}
        </div>
      </div>
      <div className="descriptionPage-post" onSubmit={handelpost}>
        <h2>Post a Response</h2>
        <form className="descriptionPage-form">
          <textarea
            className="descriptionPage-textarea-title"
            placeholder="Write your response here..."
            value={body}
            id="body"
            onChange={(e) => setBody(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            onSubmit={handelpost}
            className="descriptionPage-submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default QuestionDescriptionPage;
