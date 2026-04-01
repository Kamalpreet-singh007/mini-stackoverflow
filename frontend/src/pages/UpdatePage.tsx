import { useParams, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { QuestionContext } from '../contexts/question';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const UpdatePage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const Id = Number(id);
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  const questionContext = useContext(QuestionContext)!;
  if (!questionContext) throw new Error('QuestionContext is null');
  const { updateQuestion } = questionContext;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'question') {
      await updateQuestion(Id, body);
    }
    setBody('');
    navigate(`/question/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Update {type === 'question' ? 'Question' : 'Response'}
        </h1>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                New Content
              </label>
              <textarea
                placeholder={`Update your ${type} here...`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={6}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              />
            </div>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
