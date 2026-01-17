'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamically import components with SSR disabled
export const ButtonPreview = dynamic(
  () => import('./button-preview').then((mod) => mod.ButtonPreview),
  { ssr: false, loading: () => <PreviewLoading /> }
);

export const LoginBlockPreview = dynamic(
  () => import('./block-previews').then((mod) => mod.LoginBlockPreview),
  { ssr: false, loading: () => <PreviewLoading /> }
);

export const ProfileBlockPreview = dynamic(
  () => import('./block-previews').then((mod) => mod.ProfileBlockPreview),
  { ssr: false, loading: () => <PreviewLoading /> }
);

export const EmptyStateBlockPreview = dynamic(
  () => import('./block-previews').then((mod) => mod.EmptyStateBlockPreview),
  { ssr: false, loading: () => <PreviewLoading /> }
);

function PreviewLoading() {
  return (
    <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="text-sm text-zinc-500">Loading preview...</div>
    </div>
  );
}
