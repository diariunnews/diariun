// context/AuthContext.tsx
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
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
  // plan?: string | null; // si lo usas en el futuro
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

// --- Inactividad (configurable) ---
const IDLE_MINUTES = 30; // ⬅️ cambia aquí si quieres otro tiempo
const IDLE_MS = IDLE_MINUTES * 60 * 1000;
const LAST_ACTIVITY_KEY = "diariun:lastActivity";
const LOGOUT_BCAST_KEY = "diariun:logout";
const ACTIVITY_WRITE_THROTTLE_MS = 15_000; // persistimos actividad cada 15s máx

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // refs para timers/flags
  const idleTimerRef = useRef<number | null>(null);
  const lastWriteRef = useRef<number>(0);
  const loggedOutRef = useRef<boolean>(false);

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

  // Logout centralizado (sin redirección forzada para no romper tu UX actual)
  const logout = async () => {
    if (loggedOutRef.current) return;
    loggedOutRef.current = true;

    try {
      await supabase.auth.signOut();
    } finally {
      // Broadcast a otras pestañas
      try {
        localStorage.setItem(LOGOUT_BCAST_KEY, String(Date.now()));
      } catch (_) {}
      // limpia estado local
      setUser(null);
      setSession(null);
      setUserProfile(null);
      // Si prefieres recargar o redirigir, descomenta una:
      // window.location.reload();
       window.location.href = "/";
    }
  };

  // Timer de inactividad
  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      // Fuerza logout por inactividad
      logout();
    }, IDLE_MS);
  };

  const bumpActivity = () => {
    const now = Date.now();
    if (now - lastWriteRef.current > ACTIVITY_WRITE_THROTTLE_MS) {
      try {
        localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
      } catch (_) {}
      lastWriteRef.current = now;
    }
    resetIdleTimer();
  };

  // Obtener sesión activa al cargar + escuchar cambios (login/logout)
  useEffect(() => {
    let unsub: { subscription: { unsubscribe: () => void } } | null = null;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
      if (session?.user?.id) fetchUserProfile(session.user.id);
      else setUserProfile(null);
    });

    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
      if (session?.user?.id) fetchUserProfile(session.user.id);
      else setUserProfile(null);
      // Reinicia timer al cambiar de sesión
      if (session?.user) bumpActivity();
    });
    unsub = sub.data as any;

    return () => {
      unsub?.subscription?.unsubscribe?.();
    };
    // eslint-disable-next-line
  }, []);

  // Listeners de actividad y sincronización entre pestañas
  useEffect(() => {
    if (!user) {
      // si no hay usuario, limpia timer y listeners
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      return;
    }

    // arranca el timer
    bumpActivity();

    const events: (keyof DocumentEventMap | keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "visibilitychange",
    ];

    const handler = () => bumpActivity();
    events.forEach((evt) => window.addEventListener(evt as any, handler, { passive: true }));

    // sincroniza logout entre pestañas
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOGOUT_BCAST_KEY && e.newValue) {
        logout();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt as any, handler as any));
      window.removeEventListener("storage", onStorage);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
