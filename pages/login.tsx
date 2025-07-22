// pages/login.tsx
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useState } from 'react';
import { supabase } from '../context/AuthContext';

const translations = {
  es: {
    sign_in: {
      email_label: 'Correo electrónico',
      password_label: 'Contraseña',
      email_input_placeholder: 'Tu correo',
      password_input_placeholder: 'Tu contraseña',
      button_label: 'Iniciar sesión',
      loading_button_label: 'Entrando...',
      social_provider_text: 'Inicia sesión con',
      link_text: '¿No tienes cuenta? Regístrate',
    },
    sign_up: {
      email_label: 'Correo electrónico',
      password_label: 'Contraseña',
      email_input_placeholder: 'Tu correo',
      password_input_placeholder: 'Elige una contraseña segura',
      button_label: 'Crear cuenta',
      loading_button_label: 'Creando...',
      social_provider_text: 'Regístrate con',
      link_text: '¿Ya tienes cuenta? Inicia sesión',
      confirmation_text: 'Revisa tu correo para confirmar tu cuenta',
    },
    forgotten_password: {
      email_label: 'Tu correo electrónico',
      email_input_placeholder: 'Introduce tu correo',
      button_label: 'Recuperar contraseña',
      link_text: 'Volver a iniciar sesión',
      confirmation_text: 'Revisa tu correo para restaurar tu contraseña',
    },
    magic_link: {
      email_input_label: 'Tu correo electrónico',
      email_input_placeholder: 'Introduce tu correo',
      button_label: 'Enviar enlace mágico',
      link_text: 'Inicia sesión con contraseña',
      confirmation_text: 'Revisa tu correo para continuar',
    },
  },
  en: {
    sign_in: {
      email_label: 'Email',
      password_label: 'Password',
      email_input_placeholder: 'Your email',
      password_input_placeholder: 'Your password',
      button_label: 'Sign in',
      loading_button_label: 'Signing in...',
      social_provider_text: 'Sign in with',
      link_text: "Don't have an account? Sign up",
    },
    sign_up: {
      email_label: 'Email',
      password_label: 'Password',
      email_input_placeholder: 'Your email',
      password_input_placeholder: 'Choose a secure password',
      button_label: 'Sign up',
      loading_button_label: 'Creating...',
      social_provider_text: 'Sign up with',
      link_text: 'Already have an account? Sign in',
      confirmation_text: 'Check your email to confirm your account',
    },
    forgotten_password: {
      email_label: 'Your email',
      email_input_placeholder: 'Enter your email',
      button_label: 'Recover password',
      link_text: 'Back to sign in',
      confirmation_text: 'Check your email to reset your password',
    },
    magic_link: {
      email_input_label: 'Your email',
      email_input_placeholder: 'Enter your email',
      button_label: 'Send magic link',
      link_text: 'Sign in with password',
      confirmation_text: 'Check your email to continue',
    },
  },
};

export default function LoginPage() {
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [lang, setLang] = useState<'es' | 'en'>('es');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Language Selector */}
        <div className="flex justify-end">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'es' | 'en')}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {view === 'sign_in'
              ? lang === 'es'
                ? 'Bienvenido de nuevo'
                : 'Welcome back'
              : lang === 'es'
              ? 'Únete a Diariun'
              : 'Join Diariun'}
          </h1>
        </div>

        {/* Auth UI */}
        <Auth
          supabaseClient={supabase}
          view={view}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: { borderRadius: '6px', padding: '10px 16px', fontWeight: 600 },
              input: { borderRadius: '6px' },
              label: { fontWeight: 600 },
            },
          }}
          localization={{ variables: translations[lang] }}
          providers={['google', 'facebook']}
          redirectTo="/"
          showLinks={false}
        />

        {/* Toggle sign in/sign up */}
        <div className="text-center text-sm text-gray-600">
          {view === 'sign_in' ? (
            <span>
              {lang === 'es' ? '¿No tienes cuenta?' : "Don't have an account?"}{' '}
              <button className="text-blue-600 hover:underline" onClick={() => setView('sign_up')}>
                {lang === 'es' ? 'Regístrate' : 'Sign up'}
              </button>
            </span>
          ) : (
            <span>
              {lang === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
              <button className="text-blue-600 hover:underline" onClick={() => setView('sign_in')}>
                {lang === 'es' ? 'Inicia sesión' : 'Sign in'}
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
