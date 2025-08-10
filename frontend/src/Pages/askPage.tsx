import { useState, useContext } from 'react';
import '../Css/askpage.css';
import { QuestionContext } from '../utills/question';
export const AskQuestionPage = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const context = useContext(QuestionContext)!;
  if (!context) {
    throw new Error(
      'useContext(QuestionContext) returned null — did you forget to wrap a provider?'
    );
  }
  const { postQuestion } = context;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("in ask page ")
    const response = await postQuestion(title, body);
  };

  return (
    <div className="askpage-container">
      <h2 className="askpage-header">Ask a Question</h2>
      <form className="askpage-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <textarea
          id="title"
          placeholder="Enter the title of your question"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="askpage-textarea askpage-title"
        ></textarea>

        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          placeholder="Describe your question in detail"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="askpage-textarea askpage-body"
        ></textarea>

        <button type="submit" className="askpage-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AskQuestionPage;
