import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { supabase } = useAuth();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessTokenPresent, setAccessTokenPresent] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const hasAccessToken = hash.includes('access_token');
    setAccessTokenPresent(hasAccessToken);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Contraseña actualizada con éxito');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }

    setLoading(false);
  };

  if (!accessTokenPresent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Enlace inválido o expirado</h1>
          <p className="text-gray-600">Solicita un nuevo correo de recuperación desde el inicio de sesión.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Restablecer contraseña</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded font-semibold"
          >
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
