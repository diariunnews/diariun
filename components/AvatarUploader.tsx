import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function AvatarUploader({ avatarUrl, onUpload }: { avatarUrl?: string, onUpload: (url: string) => void }) {
  const { supabase, user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || !user) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}.${fileExt}`;

      // Sube al bucket avatars
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obtiene la URL pública
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      if (data?.publicUrl) {
        onUpload(data.publicUrl);
      }
    } catch (error: any) {
      alert("Error subiendo avatar: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={avatarUrl || "/avatar_placeholder.png"}
        alt="Avatar"
        className="w-24 h-24 rounded-full object-cover border"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        ref={fileInputRef}
      />
      <button
        type="button"
        className="bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold text-sm"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? "Subiendo..." : "Cambiar foto"}
      </button>
    </div>
  );
}
