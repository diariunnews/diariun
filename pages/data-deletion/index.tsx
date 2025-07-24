// pages/data-deletion/index.tsx
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function DataDeletion() {
  return (
    <>
      <Head>
        <title>Eliminación de Datos | Diariun</title>
        <meta name="description" content="Solicita la eliminación de tus datos de Diariun si iniciaste sesión con Facebook." />
      </Head>

      <Header />

      <main className="max-w-2xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Eliminación de Datos de Facebook</h1>
        <p className="mb-4">
          Si has iniciado sesión en Diariun usando Facebook y deseas eliminar tus datos personales,
          por favor envía una solicitud por correo electrónico a:
        </p>
        <p className="font-semibold text-blue-600 mb-6">
          privacidad@diariun.com
        </p>
        <p className="mb-4">
          En el asunto, escribe <strong>"Eliminar datos de Facebook"</strong> e incluye la dirección de correo electrónico asociada a tu cuenta.
        </p>
        <p>
          Procesaremos tu solicitud en un plazo de 7 días hábiles y recibirás una confirmación una vez completado.
        </p>
      </main>

      <Footer />
    </>
  );
}
