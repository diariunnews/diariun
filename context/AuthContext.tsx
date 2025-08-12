import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient, User, Session } from "@supabase/supabase-js";

// Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipo de perfil según tu tabla `profiles`
export type UserProfile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  rol: "user" | "admin" | "staff" | string | null;
  created_at: string | null;
  deleted_at: string | null;
  // si en el futuro guardas plan aquí, puedes añadir: plan?: string | null;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  refreshUserProfile: () => Promise<void>;
  logout: () => Promise<void>;
  supabase: typeof supabase;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Cargar perfil desde la tabla "profiles"
  const fetchUserProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url, rol, created_at, deleted_at")
      .eq("id", uid)
      .maybeSingle();

    if (!error && data) setUserProfile(data as UserProfile);
    else setUserProfile(null);
  };

  // Refrescar perfil manualmente
  const refreshUserProfile = async () => {
    if (user?.id) await fetchUserProfile(user.id);
  };

  useEffect(() => {
    // Obtener sesión activa al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
      if (session?.user?.id) fetchUserProfile(session.user.id);
      else setUserProfile(null);
    });

    // Escuchar cambios de sesión (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
      if (session?.user?.id) fetchUserProfile(session.user.id);
      else setUserProfile(null);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
  };

  const isAdmin = !!(userProfile?.rol === "admin" || userProfile?.rol === "staff");

  return (
    <AuthContext.Provider
      value={{ user, session, userProfile, isAdmin, refreshUserProfile, logout, supabase }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook de uso
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
