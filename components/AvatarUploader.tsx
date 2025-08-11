import { useState, useRef, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

type Props = {
  avatarUrl?: string | null;
  onUpload: (url: string) => void;
  displayName?: string; // opcional: si quieres forzar el nombre para las iniciales
  size?: number;        // diámetro del avatar en px (default 120)
};

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] || "";
  const b = parts[1]?.[0] || "";
  return (a + b || a).toUpperCase();
}

export default function AvatarUploader({ avatarUrl, onUpload, displayName, size = 120 }: Props) {
  const { supabase, user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const name = displayName || user?.user_metadata?.full_name || user?.email || "Usuario";
  const initials = useMemo(() => getInitials(name), [name]);

  // Para evitar caché del CDN al actualizar la misma ruta
  const cacheBustedSrc = useMemo(() => {
    if (!avatarUrl) return null;
    const sep = avatarUrl.includes("?") ? "&" : "?";
    return `${avatarUrl}${sep}v=${Date.now()}`;
  }, [avatarUrl]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || !user) return;
      const file = e.target.files[0];

      // Validaciones rápidas
      if (!/^image\//.test(file.type)) {
        alert("El archivo debe ser una imagen.");
        return;
      }
      const maxMB = 5;
      if (file.size > maxMB * 1024 * 1024) {
        alert(`La imagen no puede superar ${maxMB}MB.`);
        return;
      }

      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const filePath = `${user.id}.${ext}`; // mantenemos tu esquema (upsert)

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;
      if (publicUrl) onUpload(publicUrl);
    } catch (error: any) {
      alert("Error subiendo avatar: " + error.message);
    } finally {
      setUploading(false);
      // limpiamos el input para permitir re-subir el mismo archivo si hace falta
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative rounded-full ring-2 ring-gray-200 shadow-sm overflow-hidden"
        style={{ width: size, height: size }}
        aria-label={name}
      >
        {cacheBustedSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cacheBustedSrc}
            alt={name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-semibold select-none bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500"
               style={{ fontSize: Math.max(18, Math.floor(size * 0.28)) }}>
            {initials}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        ref={fileInputRef}
      />

      <button
        type="button"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? "Subiendo..." : "Cambiar foto"}
      </button>
    </div>
  );
}
