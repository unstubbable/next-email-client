import { ThreadHeader, ThreadList } from '@/app/components/thread-list';
import { getThreadsForFolder } from '@/lib/db/queries';
import { Suspense } from 'react';

export function generateStaticParams() {
  const folderNames = [
    'inbox',
    'starred',
    'drafts',
    'sent',
    'archive',
    'trash',
  ];

  return folderNames.map((name) => ({ name }));
}

export default function ThreadsPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ q?: string; id?: string }>;
}) {
  return (
    <div className="flex h-screen">
      <Suspense
        fallback={
          // TODO: can not use params in fallback
          <ThreadsSkeleton folderName="" />
        }
      >
        <Threads params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function ThreadsSkeleton({ folderName }: { folderName: string }) {
  return (
    <div className="flex-grow border-r border-gray-200 overflow-hidden">
      <ThreadHeader folderName={folderName} />
    </div>
  );
}

async function Threads({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ q?: string; id?: string }>;
}) {
  let { name } = await params;
  let { q } = await searchParams;
  let threads = await getThreadsForFolder(name);

  return <ThreadList folderName={name} threads={threads} searchQuery={q} />;
}
