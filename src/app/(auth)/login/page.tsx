import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
