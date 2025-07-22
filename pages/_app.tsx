// pages/_app.tsx
import "../styles/tailwind.css";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ModalProvider } from "../context/ModalContext";
import LoginModal from "../components/LoginModal";
import { useModal } from "../context/ModalContext";

function InnerApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <LoginModal />
    </>
  );
}


export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ModalProvider>
        <InnerApp Component={Component} pageProps={pageProps} />
      </ModalProvider>
    </AuthProvider>
  );
}
