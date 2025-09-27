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
    <div className="homePage  ">
      <div className="homePage-hero flex flex-col items-center justify-center bg-blue-100 text-[#212121]">
        <h1 className="hero-title text-center font-bold mt-[4rem] text-5xl">
          Welcome to Mini Stack Overflow
        </h1>
        <p className="hero-subtitle text-2xl mt-[1rem] ">
          A place to ask technical questions and get help from fellow
          developers. Jump in and share your knowledge!
        </p>
        <div className="util flex-col justify-around  my-[2rem]">
          <div className="sortby flex  items-center text-center bg-black text-white rounded-lg ">
            <div
              className="sortby-Newest border-r-2 border-white px-4 py-2 cursor-pointer"
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
              className="sortby-Most-Responses border-r-2 border-white px-4 py-2 cursor-pointer"
              onClick={() => {
                setquestions(
                  [...questions].sort(
                    (a, b) => b.response_count - a.response_count
                  )
                );
                console.log(questions);
                console.log('Most Responses clicked');
              }}
            >
              most Responses
            </div>
            <div
              className="sortby-most-upvoted border-r-2 border-white px-4 py-2 cursor-pointer"
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
          </div>
          <Link
            to="/ask"
            className="hero-button flex justify-center text-center  my-[3rem] px-4 py-4 bg-blue-500 text-white rounded-lg "
          >
            Ask a question
          </Link>
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
