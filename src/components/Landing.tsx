'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';

// Lazy load heavy components
const RifaNumbers = dynamic(() => import('@/components/RifaNumbers'), {
  loading: () => <Loading text="Loading tickets..." size="lg" />,
  ssr: false
});

function Landing() {
  return (
    <>
      <Suspense fallback={<Loading text="Loading tickets..." size="lg" />}>
        <RifaNumbers />
      </Suspense>
    </>
  );
}

export default Landing;