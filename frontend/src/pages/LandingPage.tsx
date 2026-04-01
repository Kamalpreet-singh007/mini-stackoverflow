import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-gradient" />
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-float-delayed" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-md px-4 py-1.5 text-sm text-muted-foreground animate-fade-in">
          <Zap className="h-3.5 w-3.5 text-accent" />
          Community-driven Q&A
        </div>

        {/* Heading */}
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl animate-fade-in">
          Get answers from{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            real developers
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground animate-fade-in">
          Ask technical questions, share knowledge, and help fellow developers solve real-world problems.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in">
          <Button
            size="lg"
            className="gap-2 rounded-full px-8 text-base"
            onClick={() => navigate('/home')}
          >
            Browse Questions <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 rounded-full px-8 text-base border-border bg-card/60 backdrop-blur-md"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 sm:gap-16 animate-fade-in">
          {[
            { icon: Code2, label: 'Questions', value: '1K+' },
            { icon: Users, label: 'Developers', value: '500+' },
            { icon: Zap, label: 'Answers', value: '5K+' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
