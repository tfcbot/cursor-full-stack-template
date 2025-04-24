import { AgentList } from '../../components/AgentList';

export const metadata = {
  title: 'Your Tasks - Agent',
  description: 'View all your generated tasks',
};

export default function AgentPage() {
  return <AgentList />;
}
