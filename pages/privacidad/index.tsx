// pages/privacidad/index.tsx
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Privacidad() {
  return (
    <>
      <Head>
        <title>Política de Privacidad | Diariun</title>
        <meta name="description" content="Lee nuestra política de privacidad para saber cómo protegemos tu información." />
      </Head>

      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Política de Privacidad</h1>
        <p className="text-gray-700 mb-4">
          En Diariun, respetamos tu privacidad. Esta política describe qué datos recopilamos, cómo los usamos y cómo los protegemos.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Información que recopilamos</h2>
        <p className="text-gray-700 mb-4">
          Podemos recopilar tu correo electrónico, nombre y preferencias de uso cuando interactúas con nuestra plataforma.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Cómo usamos tus datos</h2>
        <p className="text-gray-700 mb-4">
          Utilizamos tus datos para personalizar tu experiencia, enviarte comunicaciones relevantes y mejorar nuestros servicios.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Terceros</h2>
        <p className="text-gray-700 mb-4">
          No vendemos tus datos. Algunos servicios como autenticación o análisis pueden requerir compartir cierta información con terceros bajo acuerdos de privacidad.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Tus derechos</h2>
        <p className="text-gray-700 mb-4">
          Puedes acceder, modificar o eliminar tu información personal contactándonos en cualquier momento.
        </p>
      </main>

      <Footer />
    </>
  );
}
