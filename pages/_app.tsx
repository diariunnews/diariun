import "../styles/tailwind.css";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ModalProvider } from "../context/ModalContext";
import LoginModal from "../components/LoginModal";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App({ Component, pageProps }) {
  useEffect(() => {
    // Importa el CSS de React Quill sólo en el cliente
    import('react-quill/dist/quill.snow.css');
  }, []);

  return (
    <AuthProvider>
      <ModalProvider>
        <>
          <Component {...pageProps} />
          <LoginModal />
          <Toaster position="top-center" />
        </>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
