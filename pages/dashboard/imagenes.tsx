import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import { Plus, Trash2, Loader2, Upload, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Utilidad classNames sencilla (sustituye a cn de shadcn/ui)
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// Lista de categorías (puedes traer de tabla si tienes)
const CATEGORIAS = [
  "Blog",
  "SEO",
  "Redes Sociales",
  "Portada",
  "Inspiración",
  "Personalizadas",
];

type Imagen = {
  id: string;
  url: string;
  title?: string;
  prompt?: string;
  categoria?: string;
  type: "upload" | "ai";
  created_at: string;
};

export default function ImagenesDashboard() {
  const { user, supabase } = useAuth();
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Estado para SD
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [aiCategoria, setAICategoria] = useState(CATEGORIAS[0]);
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  // Cargar imágenes al inicio (ahora con async/await)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("imagenes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setImagenes(data || []);
      setLoading(false);
    })();
  }, [user]);

  // Subir imagen a Storage y guardar en tabla
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileRef.current?.files?.[0]) return;
    setUploading(true);
    setUploadError(null);
    const file = fileRef.current.files[0];
    const ext = file.name.split('.').pop();
    const filename = `${user!.id}/${Date.now()}.${ext}`;

    // 1. Subir a Supabase Storage (bucket: "imagenes")
    const { data: storageData, error: storageError } = await supabase.storage
      .from("imagenes")
      .upload(filename, file, { cacheControl: "3600", upsert: false });

    if (storageError) {
      setUploadError("Error subiendo imagen: " + storageError.message);
      setUploading(false);
      return;
    }

    // 2. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("imagenes")
      .getPublicUrl(filename);

    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) {
      setUploadError("No se pudo obtener la URL pública de la imagen.");
      setUploading(false);
      return;
    }

    // 3. Guardar registro en tabla "imagenes"
    const { error: dbError, data: dbData } = await supabase
      .from("imagenes")
      .insert([
        {
          user_id: user!.id,
          url: publicUrl,
          title: file.name,
          type: "upload",
          categoria: "Sin categoría", // Puedes pedir categoría si quieres en el modal
        },
      ])
      .select()
      .single();

    if (dbError) {
      setUploadError("Error guardando imagen en la base de datos: " + dbError.message);
      setUploading(false);
      return;
    }

    setImagenes((prev) => [dbData, ...prev]);
    setShowUpload(false);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Eliminar imagen
  const handleDelete = async (img: Imagen) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    const path = img.url.split("/storage/v1/object/public/imagenes/")[1];
    if (path) await supabase.storage.from("imagenes").remove([path]);
    await supabase.from("imagenes").delete().eq("id", img.id);
    setImagenes(imagenes.filter((i) => i.id !== img.id));
  };

  // Generar imagen con IA (SD)
  const handleAIGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAILoading(true);
    setAIError(null);

    // 1. Llama a tu endpoint que genera imagen (debe devolver una URL de imagen válida)
    const res = await fetch("/api/sd-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: aiPrompt }),
    });
    if (!res.ok) {
      setAIError("Error generando la imagen IA.");
      setAILoading(false);
      return;
    }
    const { imageUrl } = await res.json();
    if (!imageUrl) {
      setAIError("No se pudo obtener la imagen generada.");
      setAILoading(false);
      return;
    }

    // 2. Descarga la imagen y la sube a tu storage
    const imageBlob = await fetch(imageUrl).then(r => r.blob());
    const ext = "png";
    const filename = `${user!.id}/ai-${Date.now()}.${ext}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("imagenes")
      .upload(filename, imageBlob, { cacheControl: "3600", upsert: false, contentType: "image/png" });

    if (storageError) {
      setAIError("Error subiendo imagen: " + storageError.message);
      setAILoading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("imagenes").getPublicUrl(filename);
    const publicUrl = urlData?.publicUrl;

    // 3. Guardar en la tabla
    const { error: dbError, data: dbData } = await supabase
      .from("imagenes")
      .insert([
        {
          user_id: user!.id,
          url: publicUrl,
          prompt: aiPrompt,
          title: `Generada IA`,
          type: "ai",
          categoria: aiCategoria,
        },
      ])
      .select()
      .single();

    if (dbError) {
      setAIError("Error guardando imagen IA: " + dbError.message);
      setAILoading(false);
      return;
    }

    setImagenes((prev) => [dbData, ...prev]);
    setShowAI(false);
    setAILoading(false);
    setAIPrompt("");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-2">
            <h2 className="text-2xl font-bold">Mis imágenes</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAI(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                <Sparkles size={18} /> Crear con IA
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                <Plus size={18} /> Subir imagen
              </button>
            </div>
          </div>

          {/* Modal de Upload */}
          {showUpload && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
                <button
                  className="absolute top-3 right-4 text-gray-400 hover:text-black"
                  onClick={() => setShowUpload(false)}
                >
                  ✕
                </button>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Upload size={20} /> Subir nueva imagen
                </h3>
                <form className="space-y-5" onSubmit={handleUpload}>
                  <input
                    type="file"
                    ref={fileRef}
                    accept="image/*"
                    required
                    className="block w-full border rounded-lg p-2"
                    disabled={uploading}
                  />
                  <button
                    type="submit"
                    disabled={uploading}
                    className={cn("bg-black text-white w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2", uploading && "opacity-60")}
                  >
                    {uploading && <Loader2 size={18} className="animate-spin" />}
                    {uploading ? "Subiendo…" : "Subir"}
                  </button>
                  {uploadError && <div className="text-red-600 text-sm">{uploadError}</div>}
                </form>
              </div>
            </div>
          )}

          {/* Modal de IA */}
          {showAI && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
                <button
                  className="absolute top-3 right-4 text-gray-400 hover:text-black"
                  onClick={() => setShowAI(false)}
                >
                  ✕
                </button>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={20} /> Generar imagen con IA
                </h3>
                <form className="space-y-5" onSubmit={handleAIGenerate}>
                  <div>
                    <label className="block mb-1 font-medium">¿Qué imagen quieres crear?</label>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={e => setAIPrompt(e.target.value)}
                      placeholder="Describe la imagen que quieres crear"
                      className="block w-full border rounded-lg p-2"
                      required
                      disabled={aiLoading}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Categoría</label>
                    <select
                      value={aiCategoria}
                      onChange={e => setAICategoria(e.target.value)}
                      className="block w-full border rounded-lg p-2"
                      disabled={aiLoading}
                    >
                      {CATEGORIAS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className={cn("bg-purple-600 text-white w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2", aiLoading && "opacity-60")}
                  >
                    {aiLoading && <Loader2 size={18} className="animate-spin" />}
                    {aiLoading ? "Generando…" : "Crear con IA"}
                  </button>
                  {aiError && <div className="text-red-600 text-sm">{aiError}</div>}
                </form>
              </div>
            </div>
          )}

          {/* Galería */}
          {loading ? (
            <div className="text-gray-500 text-center py-16">Cargando imágenes…</div>
          ) : imagenes.length === 0 ? (
            <div className="text-gray-400 text-center py-20">
              Todavía no tienes imágenes.<br />
              <span className="text-sm">¡Sube tu primera imagen o créala con IA!</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {imagenes.map((img) => (
                <div key={img.id} className="bg-white rounded-xl shadow p-2 relative group">
                  <img
                    src={img.url}
                    alt={img.title || "Imagen"}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="mt-2">
                    <div className="text-xs font-medium truncate">{img.title || "Sin título"}</div>
                    {img.prompt && (
                      <div className="text-[11px] text-purple-600 truncate italic">"{img.prompt}"</div>
                    )}
                    <div className="text-xs text-gray-400 flex justify-between">
                      <span>{img.categoria || "Sin categoría"}</span>
                      <span>{format(new Date(img.created_at), "d MMMM yyyy", { locale: es })}</span>
                    </div>
                  </div>
                  <button
                    className="absolute top-2 right-2 bg-white/80 hover:bg-red-500 hover:text-white text-gray-700 p-1 rounded-full transition opacity-0 group-hover:opacity-100"
                    title="Eliminar imagen"
                    onClick={() => handleDelete(img)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
