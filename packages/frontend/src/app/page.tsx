import { ResearchForm } from '../components/ResearchForm';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-fg-primary">Research Agent</h1>
        <p className="text-fg-secondary">Submit research tasks and get comprehensive results</p>
      </div>
      
      <ResearchForm />
      
      <div className="mt-12 bg-bg-secondary bg-opacity-60 p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold mb-3 text-fg-primary">How it works</h2>
        <ol className="list-decimal space-y-2 pl-5 text-fg-secondary">
          <li>Enter a topic for your research</li>
          <li>Select the desired length and tone</li>
          <li>Click "Submit Research Task" and wait for the magic</li>
          <li>View, copy, or generate more research as needed</li>
        </ol>
      </div>
    </div>
  );
}
