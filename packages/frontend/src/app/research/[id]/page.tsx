import { ResearchDetail } from '@/src/components/ResearchDetail';

export default function ResearchDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <ResearchDetail id={params.id} />
    </div>
  );
}
