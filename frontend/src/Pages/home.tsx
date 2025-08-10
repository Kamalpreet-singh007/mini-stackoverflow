import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { QuestionCard } from '../Components/questioncard';
import { QuestionContext } from '../utills/question';
import type { Question } from '../types';
import '../Css/home.css';

function Home() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error(
      'useContext(QuestionContext) returned null — did you forget to wrap a provider?'
    );
  }
  const { getquestions, setquestions, questions } = context;
  useEffect(() => {
    getquestions();
  }, []);

  return (
    <div className="homePage">
      <div className="homePage-hero">
        <h1 className="hero-title">Welcome to Mini Stack Overflow</h1>
        <p className="hero-subtitle">
          A place to ask technical questions and get help from fellow
          developers. Jump in and share your knowledge!
        </p>
        <Link to="/ask" className="hero-button">
          Ask a question
        </Link>
      </div>
      <div className="sortby">
        <div
          className="sortby-Newest"
          onClick={() => {
            setquestions(
              [...questions].sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
            );
            console.log(questions);
            console.log('Newest clicked');
          }}
        >
          Newest
        </div>
        <div
          className="sortby-Most-Responses"
          onClick={() => {
            setquestions(
              [...questions].sort((a, b) => b.response_count - a.response_count)
            );
            console.log(questions);
            console.log('Most Responses clicked');
          }}
        >
          most Responses
        </div>
        <div
          className="sortby-most-upvoted"
          onClick={() => {
            setquestions(
              [...questions].sort((a, b) => b.upvote_count - a.upvote_count)
            );
            console.log(questions);
            console.log('Most Upvoted clicked');
          }}
        >
          Most-Upvoted
        </div>
        <div className="homePage-questions">
          {(questions ?? []).map((q: Question) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Home;
