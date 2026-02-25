import { Suspense } from 'react';
import CheckoutSuccessContent from '@/components/CheckoutSuccessContent';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}