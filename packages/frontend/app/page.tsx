import { ContentForm } from './components/ContentForm';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-fg-primary">Content Generator</h1>
        <p className="text-fg-secondary">Create custom content with just a few clicks</p>
      </div>
      
      <ContentForm />
      
      <div className="mt-12 bg-bg-secondary bg-opacity-60 p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold mb-3 text-fg-primary">How it works</h2>
        <ol className="list-decimal space-y-2 pl-5 text-fg-secondary">
          <li>Enter a topic for your content</li>
          <li>Select the desired length and tone</li>
          <li>Click "Generate Content" and wait for the magic</li>
          <li>View, copy, or generate more content as needed</li>
        </ol>
      </div>
    </div>
  );
}
