import { QuestionContext } from '../utills/question';
import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Response } from '../types';
import '../Css/questiondescriptionpage.css';
import { formatDistanceToNow } from 'date-fns';
import { ResponseCard } from '../Components/responsecard';

export const QuestionDescriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const questionid = id;
  const [responses, setResponses] = useState<Response[]>([]);

  const updateResponse = (updated: Response) => {
    setResponses((prevResponses) =>
      prevResponses.map((res) => (res.id === updated.id ? updated : res))
    );
  };
  const questionContext = useContext(QuestionContext);
  if (!questionContext) {
    throw new Error(
      'useContext(QuestionContext) returned null — did you forget to wrap a provider?'
    );
  }
  const { getQuestionDescription, questions, postResponse, getquestions } =
    questionContext;
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!questions) {
      // This will fetch and set questions in context
      getquestions();
    }
  }, [questions, questionContext]);
  useEffect(() => {
    setLoading(true);
    console.log('in question description page useEffect');
    try {
      const fetchQuestionDescription = async () => {
        const result = await getQuestionDescription(Number(questionid));
        console.log('in question description page result', result);
        setQuestionDescription(result);
        console.log(questionDescription);
      };
      fetchQuestionDescription();
    } catch (err) {
      console.error('Failed to load question:', err);
    } finally {
      setLoading(false);
    }
  }, [questionid, getQuestionDescription]);

  const [questionDescription, setQuestionDescription] = useState<Response[]>(
    []
  );

  if (!questions) {
    return <div>Loading questions...</div>;
  }
  const currentQuestion = questions?.find((q) => q.id === Number(questionid))!;

  console.log('currentQuestion in question description page', currentQuestion);

  if (loading) {
    return <div>Loading question...</div>;
  }
  const handelpost = async (e: React.FormEvent) => {
    e.preventDefault();
    await postResponse(currentQuestion.id, body);
    setBody('');
  };
  console.log(questionDescription);
  return (
    <div className="descriptionPage">
      <div className="descriptionPage-content">
        <div className="descriptionPage-mainline">
          <div className="descriptionPage-question-upvote">
            <p>upvote</p>
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
          {questionDescription.map((res) => (
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
