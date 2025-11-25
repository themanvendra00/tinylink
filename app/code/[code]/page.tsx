import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import StatsCard from '@/components/StatsCard';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function StatsPage({ params }: PageProps) {
  const { code } = await params;

  const link = await db.link.findUnique({
    where: { code },
  });

  if (!link) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <StatsCard
      link={{
        ...link,
        lastClickedAt: link.lastClickedAt,
        createdAt: link.createdAt,
      }}
      baseUrl={baseUrl}
    />
  );
}

