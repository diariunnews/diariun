import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function SignupForm() {
  const { supabase } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg("Revisa tu correo para confirmar tu cuenta.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Crear cuenta</h2>

      {/* Botones sociales */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.35 11.1h-9.18v2.99h5.42c-.22 1.27-.88 2.36-1.88 3.11v2.59h3.06c1.79-1.65 2.82-4.08 2.82-6.98 0-.47-.04-.93-.12-1.37z" />
            <path d="M12.17 22c2.4 0 4.41-.79 5.88-2.14l-3.06-2.59c-.85.57-1.93.9-2.82.9-2.17 0-4-1.47-4.66-3.45h-3.13v2.62C6.54 19.98 9.12 22 12.17 22z" />
            <path d="M7.51 14.72c-.25-.75-.39-1.56-.39-2.39s.14-1.64.39-2.39V7.32H4.38C3.65 8.84 3.22 10.57 3.22 12.33s.43 3.49 1.16 5.01l3.13-2.62z" />
            <path d="M12.17 6.21c1.3 0 2.46.45 3.38 1.34l2.53-2.53C16.57 3.49 14.56 2.67 12.17 2.67 9.12 2.67 6.54 4.69 5.16 7.32l3.13 2.62c.66-1.98 2.49-3.45 4.66-3.45z" />
          </svg>
          Continuar con Google
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.12 8.44 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 17 22 12z" />
          </svg>
          Continuar con Facebook
        </button>
      </div>

      <div className="text-center text-gray-500 my-4">o con tu correo electrónico</div>

      {/* Formulario de correo */}
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition"
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}
