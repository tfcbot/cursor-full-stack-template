import { ResearchDetail } from '../../../components/ResearchDetail';

type Params = {
  id: string;
};

type Props = {
  params: Params;
};

export default function ResearchDetailPage({ params }: Props) {
  return <ResearchDetail researchId={params.id} />;
}

export function generateMetadata({ params }: Props) {
  return {
    title: `Research: ${params.id} - Research Agent`,
    description: `View generated research details for ID: ${params.id}`,
  };
}