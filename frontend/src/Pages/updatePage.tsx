import { useParams } from 'react-router-dom';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionContext } from '../utills/question';
export const Update = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const Id = Number(id);
  const [body, setBody] = useState<string>('');
  const navigate = useNavigate();
  const questionContext = useContext(QuestionContext)!;
  if (!questionContext) {
    throw new Error(
      'useContext(QuestionContext) returned null — did you forget to wrap a provider?'
    );
  }
  const { updateQuestion } = questionContext;

  console.log(`Type: ${type}, ID: ${id}`);
  const handelUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'question') {
      await updateQuestion(Id, body);
      console.log(`Updating question with ID: ${id} and body: ${body}`);
    }
    if (type === 'response') {
      console.log(`Updating response with ID: ${id} and body: ${body}`);
    }
    setBody('');
    navigate(`/question/${id}`);
  };
  return (
    <>
      {type === 'question' && (
        <>
          <h2>Update Question</h2>
          <form onSubmit={handelUpdate} className="updatePage-form">
            <textarea
              id="body"
              placeholder="Update your question here"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="updatePage-textarea "
            ></textarea>
            <button type="submit">Update</button>
          </form>
        </>
      )}
      {type === 'response' && (
        <>
          <h2>Update Response</h2>
          <form onSubmit={handelUpdate} className="updatePage-form">
            <textarea
              id="body"
              placeholder="Update your response here"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="updatePage-textarea "
            ></textarea>
            <button type="submit">Update</button>
          </form>
        </>
      )}
    </>
  );
};

export default Update;
