
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import Landing from '@/components/Landing';
import Sponsors from '@/components/Sponsors';


const TripSection = dynamic(() => import('@/components/TripSection'), {
  loading: () => <Loading text="Loading trip details..." />,
  ssr: true
});

const DentalSection = dynamic(() => import('@/components/DentalSection'), {
  loading: () => <Loading text="Loading dental section..." />,
  ssr: true
});

const HomeHero = dynamic(() => import('@/components/HomeHero'), {
  loading: () => <Loading text="Loading..." size="lg" />,
  ssr: true
});

const SegundoPremio = dynamic(() => import('@/components/SegundoPremio'), {
  loading: () => <Loading text="Loading segundo premio section..." />,
  ssr: true
});
export default function HomePage() {
  return (
    <>
      <Suspense fallback={<Loading text="Loading hero section..." size="lg" />}>
        <HomeHero />
      </Suspense>
      
      <Suspense fallback={<Loading text="Loading trip details..." />}>
        <TripSection />
      </Suspense>
      
      <Suspense fallback={<Loading text="Loading dental section..." />}>
        <DentalSection />
      </Suspense>

      <Suspense fallback={<Loading text="Loading second prize section..." />}>
        <SegundoPremio />
      </Suspense>

      <Suspense fallback={<Loading text="Loading sponsors section..." />}>
        <Sponsors />
      </Suspense>

      <Suspense fallback={<Loading text="Loading tickets..." size="lg" />}>
        <Landing />
      </Suspense>
    </>
  );
}