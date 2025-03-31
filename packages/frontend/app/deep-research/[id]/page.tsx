import { DeepResearchDetail } from '../../components/DeepResearchDetail';

type DeepResearchDetailPageProps = {
  params: {
    id: string;
  };
};

export default function DeepResearchDetailPage({ params }: DeepResearchDetailPageProps) {
  // Access params.id properly using Next.js conventions
  const { id } = params;
  return <DeepResearchDetail deepResearchId={id} />;
}

// Since we're using a dynamic route, we need to generate metadata dynamically
export async function generateMetadata({ params }: DeepResearchDetailPageProps) {
  const { id } = params;
  return {
    title: `Research Details - Deep Research Generator`,
    description: 'View generated research details',
  };
} 