import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SchemesClient from './SchemesClient';

export default function SchemesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf7f2]"><Loader2 className="w-8 h-8 text-[#0271BC] animate-spin" /></div>}>
      <SchemesClient />
    </Suspense>
  );
}
