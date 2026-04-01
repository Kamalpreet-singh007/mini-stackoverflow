import { useState, useContext } from 'react';
import { QuestionContext } from '../contexts/question';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const AskQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const context = useContext(QuestionContext)!;
  if (!context) throw new Error('QuestionContext is null');
  const { postQuestion } = context;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await postQuestion(title, body);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Ask a Question</h1>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1.5">
                Title
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Be specific and imagine you're asking a question to another person.
              </p>
              <input
                id="title"
                type="text"
                placeholder="e.g. How do I center a div in CSS?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-foreground mb-1.5">
                Body
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Include all the information someone would need to answer your question.
              </p>
              <textarea
                id="body"
                placeholder="Describe your question in detail..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={8}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              />
            </div>

            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" /> Post Your Question
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionPage;
