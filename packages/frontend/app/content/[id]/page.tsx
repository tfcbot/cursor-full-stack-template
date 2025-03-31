import { ContentDetail } from '../../components/ContentDetail';

type ContentDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ContentDetailPage({ params }: ContentDetailPageProps) {
  // Access params.id properly using Next.js conventions
  const { id } = params;
  return <ContentDetail contentId={id} />;
}

// Since we're using a dynamic route, we need to generate metadata dynamically
export async function generateMetadata({ params }: ContentDetailPageProps) {
  const { id } = params;
  return {
    title: `Content Details - Content Generator`,
    description: 'View generated content details',
  };
} 