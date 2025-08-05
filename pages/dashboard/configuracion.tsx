import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import AvatarUploader from "../../components/AvatarUploader";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

export default function ConfiguracionUsuario() {
  const { user, supabase } = useAuth();
  const [nombre, setNombre] = useState(user?.user_metadata?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [creditos, setCreditos] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>("Gratis"); // Ajusta si tienes lógica real de planes
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordGuardando, setPasswordGuardando] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [borrando, setBorrando] = useState(false);

  // Trae créditos reales si tienes función
  useEffect(() => {
  if (!user) return;
  supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single()
    .then(({ data, error }) => {
      if (!error && data?.avatar_url) setAvatarUrl(data.avatar_url);
      else if (user.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
    });
}, [user, supabase]);


  // Callback al subir avatar
  const handleAvatarUpload = async (url: string) => {
    setAvatarUrl(url);
    // Actualiza el campo en Supabase
    await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);
  };

  // Actualizar nombre de usuario en Supabase
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");
    setError("");
    try {
      const { error } = await supabase.auth.updateUser({ data: { full_name: nombre } });
      await supabase
        .from("profiles")
        .update({ full_name: nombre })
        .eq("id", user.id);
      if (error) {
        setError("Error al guardar cambios: " + error.message);
      } else {
        setMensaje("Cambios guardados correctamente.");
      }
    } catch (e: any) {
      setError("Error inesperado: " + e.message);
    }
    setGuardando(false);
  };

  // Cambiar contraseña
  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordGuardando(true);
    setPasswordMsg("");
    if (password.length < 8) {
      setPasswordMsg("La contraseña debe tener al menos 8 caracteres.");
      setPasswordGuardando(false);
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setPasswordMsg("Error: " + error.message);
      } else {
        setPasswordMsg("Contraseña cambiada correctamente.");
        setPassword("");
      }
    } catch (e: any) {
      setPasswordMsg("Error inesperado: " + e.message);
    }
    setPasswordGuardando(false);
  };

  // Borrar cuenta (soft delete)
  const handleBorrarCuenta = async () => {
    if (!confirm("¿Seguro que quieres borrar tu cuenta? Esta acción es irreversible.")) return;
    setBorrando(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("No session token found.");
      const res = await fetch("/api/delete-user", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Cuenta borrada correctamente.");
        await supabase.auth.signOut();
        window.location.href = "/";
      } else {
        setError("Error al borrar la cuenta.");
      }
    } catch (e: any) {
      setError("Error inesperado: " + e.message);
    }
    setBorrando(false);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow p-8 space-y-8">
            <h1 className="text-2xl font-bold mb-2 text-center">Configuración de usuario</h1>
            
            {/* Avatar editable */}
            <div className="flex flex-col items-center mb-6">
              <AvatarUploader avatarUrl={avatarUrl} onUpload={handleAvatarUpload} />
            </div>
            
            {/* Resumen de plan y créditos */}
            <div className="bg-gray-100 rounded-xl p-4 mb-8 flex flex-col items-center">
              <div className="text-sm text-gray-500">Mi plan</div>
              <div className="text-lg font-bold">{plan}</div>
              <div className="mt-2 text-sm text-gray-500">Créditos disponibles</div>
              <div className="text-2xl font-bold text-yellow-600">{creditos === null ? "..." : creditos}</div>
              <a
                href="/comprar-creditos"
                className="mt-3 bg-black text-white px-3 py-1 rounded-lg text-sm font-semibold"
              >
                Comprar créditos
              </a>
            </div>

            {/* Editar datos */}
            <form className="space-y-6" onSubmit={handleGuardar}>
              <div>
                <label className="block mb-2 font-medium">Nombre</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  disabled={guardando}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Correo electrónico</label>
                <input
                  type="email"
                  className="w-full border rounded-lg p-2 bg-gray-100 text-gray-500"
                  value={user?.email || ""}
                  disabled
                />
                <div className="text-xs text-gray-400 mt-1">El email solo puede ser cambiado por soporte.</div>
              </div>
              <button
                type="submit"
                className="bg-black text-white px-5 py-2 rounded-lg font-semibold mt-2 w-full"
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
              {mensaje && <div className="text-green-600 font-medium mt-2">{mensaje}</div>}
              {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
            </form>

            {/* Cambiar contraseña */}
            <form className="space-y-4 border-t pt-6" onSubmit={handleCambiarPassword}>
              <label className="block font-medium mb-2">Cambiar contraseña</label>
              <input
                type="password"
                className="w-full border rounded-lg p-2"
                placeholder="Nueva contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={passwordGuardando}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold w-full"
                disabled={passwordGuardando}
              >
                {passwordGuardando ? "Guardando..." : "Cambiar contraseña"}
              </button>
              {passwordMsg && (
                <div className={`${passwordMsg.includes("correcta") ? "text-green-600" : "text-red-600"} font-medium mt-2`}>
                  {passwordMsg}
                </div>
              )}
            </form>

            {/* Borrar cuenta */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-bold mb-3 text-red-600">Borrar cuenta</h2>
              <p className="text-gray-700 mb-4">Si deseas eliminar tu cuenta y todos tus datos, puedes hacerlo aquí. Esta acción es irreversible.</p>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold w-full"
                onClick={handleBorrarCuenta}
                disabled={borrando}
              >
                {borrando ? "Borrando..." : "Borrar mi cuenta"}
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
