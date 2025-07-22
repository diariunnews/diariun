import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

export default function LoginModal() {
  const { isOpen, modalType, closeModal } = useModal();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');

  if (modalType !== 'login') return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Backdrop */}
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
            {/* Modal */}
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
                  {view === 'sign_in' ? 'Welcome back' : 'Join Diariun'}
                </Dialog.Title>

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
                  view={view}
                  showLinks={false}
                  theme="light"
                  redirectTo="/"
                />

                <div className="mt-4 text-center">
                  {view === 'sign_in' ? (
                    <p className="text-sm">
                      Don’t have an account?{' '}
                      <button
                        onClick={() => setView('sign_up')}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm">
                      Already have an account?{' '}
                      <button
                        onClick={() => setView('sign_in')}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Log in
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
