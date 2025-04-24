import { AgentDetail } from '../../../components/AgentDetail';

export default async function DemoPage({ params }: { params: Promise<{ id: string }> }) {
  // then get id like this
  const id = (await params).id;
  return <AgentDetail agentId={id} />;
}
