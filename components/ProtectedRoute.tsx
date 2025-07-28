import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Solo redirige si user es null (sincrónico o tras inicialización)
    if (user === null) {
      router.replace('/');
    } else {
      setChecked(true);
    }
  }, [user, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">Cargando...</span>
      </div>
    );
  }

  return <>{children}</>;
}
