import { Suspense } from 'react';
import HomeClient from './HomeClient';
import LoadingSpinner from './components/LoadingSpinner';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-gradient-to-b from-gray-900 to-black text-white">
      <Suspense fallback={<LoadingSpinner />}>
        <HomeClient />
      </Suspense>
    </main>
  );
}