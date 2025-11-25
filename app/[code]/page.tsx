import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const { code } = await params;

  const link = await db.link.findUnique({
    where: { code },
  });

  if (!link) {
    notFound();
  }

  // Update click count and last clicked time atomically
  await db.link.update({
    where: { code },
    data: {
      clickCount: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  // Perform 302 redirect
  redirect(link.originalUrl);
}

