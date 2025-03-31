import { DeepResearchDetail } from '../../components/DeepResearchDetail';

type DeepResearchDetailPageProps = {
  params: {
    id: string;
  };
};

// Make the page component async to properly handle params
export default async function DeepResearchDetailPage({ params }: DeepResearchDetailPageProps) {
  // Await the params object before destructuring
  const { id } = await params;
  return <DeepResearchDetail deepResearchId={id} />;
}

// Since we're using a dynamic route, we need to generate metadata dynamically
export async function generateMetadata({ params }: DeepResearchDetailPageProps) {
  // Await the params object before destructuring
  const { id } = await params;
  return {
    title: `Research Details - Deep Research Generator`,
    description: 'View generated research details',
  };
} 