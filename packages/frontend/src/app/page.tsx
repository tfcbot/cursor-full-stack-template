import { ResearchForm } from '../components/ResearchForm';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-fg-primary">Research Agent</h1>
        <p className="text-fg-secondary">Submit research tasks and get comprehensive results</p>
      </div>
      
      <ResearchForm />
    </div>
  );
}
