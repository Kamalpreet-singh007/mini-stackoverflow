import { QuestionCard } from '../components/QuestionCard';
import { useState, useContext, useEffect } from 'react';
import { QuestionContext } from '../contexts/question';
import { AuthContext } from '../contexts/auth';
import type { Question } from '../types';

const QuestionsPage = () => {
  const questionContext = useContext(QuestionContext);
  if (!questionContext) throw new Error('QuestionContext is null');
  const { getquestions } = questionContext;

  const userContext = useContext(AuthContext);
  if (!userContext) throw new Error('AuthContext is null');
  const { user } = userContext;

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      const allQuestions = await getquestions();
      const userQuestions = allQuestions.filter((q) => q.author.id === user?.id);
      setQuestions(userQuestions);
    };
    fetchQuestion();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Questions</h1>
        {questions.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">You haven't asked any questions yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
