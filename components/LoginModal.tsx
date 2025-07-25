import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function LoginModal() {
  const { isOpen, modalType, closeModal } = useModal();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');
  const { supabase } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' && modalType === 'login') {
        toast.success('Bienvenido de nuevo 👋');
        closeModal();
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [modalType, closeModal, supabase.auth]);

  if (modalType !== 'login') return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Revisa tu correo para confirmar tu cuenta.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }

    setLoading(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold mb-4 text-center">
                  {view === 'sign_in' ? 'Bienvenido de nuevo' : 'Crea tu cuenta en Diariun'}
                </Dialog.Title>

                {view === 'sign_in' ? (
                  <Auth
                    supabaseClient={supabase}
                    appearance={{
                      theme: ThemeSupa,
                      style: {
                        button: { borderRadius: '6px', padding: '10px', fontWeight: 600 },
                        input: { borderRadius: '6px' },
                        label: { fontWeight: '500' },
                      },
                    }}
                    providers={['google', 'facebook']}
                    view="sign_in"
                    showLinks={false}
                    theme="light"
                    redirectTo="/"
                  />
                ) : (
                  <>
                    {/* Botones sociales arriba en Sign Up */}
                    <Auth
                      supabaseClient={supabase}
                      appearance={{
                        theme: ThemeSupa,
                        style: {
                          button: { borderRadius: '6px', padding: '10px', fontWeight: 600 },
                          input: { borderRadius: '6px' },
                          label: { fontWeight: '500' },
                        },
                      }}
                      providers={['google', 'facebook']}
                      onlyThirdPartyProviders
                      showLinks={false}
                      theme="light"
                      redirectTo="/"
                    />

                    <div className="my-4 text-center text-sm text-gray-500">o regístrate con tu correo</div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      {error && <p className="text-red-600 text-sm">{error}</p>}
                      {message && <p className="text-green-600 text-sm">{message}</p>}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-2 rounded font-semibold"
                      >
                        {loading ? 'Registrando...' : 'Crear cuenta'}
                      </button>
                    </form>
                  </>
                )}

                <div className="mt-4 text-center">
                  {view === 'sign_in' ? (
                    <p className="text-sm">
                      ¿No tienes cuenta?{' '}
                      <button
                        onClick={() => setView('sign_up')}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Regístrate
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm">
                      ¿Ya tienes cuenta?{' '}
                      <button
                        onClick={() => setView('sign_in')}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Inicia sesión
                      </button>
                    </p>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
