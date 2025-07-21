import { useEffect, useState } from "react";
import { supabase } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleEmailLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Revisa tu correo para continuar.");
  };

  const handleOAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-center text-3xl font-serif font-semibold">
          {view === "sign-in" ? "Welcome back." : "Join Diariun."}
        </h2>

        <div className="space-y-4">
          <button
            onClick={handleOAuth}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 hover:bg-gray-50"
          >
            <FcGoogle className="text-xl" />
            {view === "sign-in" ? "Sign in with Google" : "Sign up with Google"}
          </button>

          <div className="relative text-center text-gray-500 text-sm">
            <span className="bg-white px-2 relative z-10">or</span>
            <div className="absolute inset-0 border-t border-gray-200 top-3"></div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailLogin();
            }}
            className="space-y-4"
          >
            <div>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              <Mail size={18} />
              {loading
                ? "Sending magic link..."
                : view === "sign-in"
                ? "Sign in with email"
                : "Sign up with email"}
            </button>
          </form>
        </div>

        <div className="text-center text-sm text-gray-600">
          {view === "sign-in" ? (
            <>
              No account?{" "}
              <button
                onClick={() => setView("sign-up")}
                className="underline hover:text-black"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setView("sign-in")}
                className="underline hover:text-black"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
