import { ResearchDetail } from '../../components/ResearchDetail';

type ResearchDetailPageProps = {
  params: {
    id: string;
  };
};

// Make the page component async to properly handle params
export default async function ResearchDetailPage({ params }: ResearchDetailPageProps) {
  // Await the params object before destructuring
  const { id } = await params;
  return <ResearchDetail researchId={id} />;
}

// Since we're using a dynamic route, we need to generate metadata dynamically
export async function generateMetadata({ params }: ResearchDetailPageProps) {
  // Await the params object before destructuring
  const { id } = await params;
  return {
    title: `Research Details - Research Agent`,
    description: 'View generated research details',
  };
} 