// components/AdminRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Espera a tener user resuelto para decidir
    if (user === null) { setReady(true); }
    if (user) { setReady(true); }
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/dashboard"); // o a tu login del panel
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }
  }, [ready, user, isAdmin, router]);

  if (!ready) return null;
  if (!user || !isAdmin) return null;

  return <>{children}</>;
}
