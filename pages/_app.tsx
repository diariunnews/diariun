import "../styles/tailwind.css";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ModalProvider } from "../context/ModalContext";
import LoginModal from "../components/LoginModal";
import { Toaster } from "react-hot-toast";

function InnerApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <LoginModal />
      <Toaster position="top-center" />
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
