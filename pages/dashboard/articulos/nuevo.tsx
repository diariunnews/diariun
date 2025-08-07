import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import DashboardLayout from "../../../components/DashboardLayout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { Tag, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchCategorias } from "../../../utils/categorias";
import { crearArticulo } from "../../../utils/articulos";
import { getCreditosUsuario, restarCredito } from "../../../utils/creditos";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const keywordExamples = ["SEO avanzado", "Blog viral", "Optimización de contenido"];
const idiomasDisponibles = [
  { code: "es", label: "Español" },
  { code: "en", label: "Inglés" },
  { code: "fr", label: "Francés" },
];
// --- Lista de palabras prohibidas ---
const PALABRAS_PROHIBIDAS = [
  "pornografía", "porno", "xxx", "sexual", "violación",
  "pedofilia", "pederastia", "puta", "follar", "mierda", "joder",
  "puto", "putas", "sexo", "masturbar", "masturbación",
  "coño", "polla", "maricón", "cabron", "cabrón", "gilipollas",
  "violento", "violencia", "drogas", "asesinato", "suicidio",
  "terrorismo", "matar", "muerte", "asesino"
  // Añade las que quieras
];
function contienePalabraProhibida(texto: string): string | null {
  const lower = texto.toLowerCase();
  const match = PALABRAS_PROHIBIDAS.find(palabra => lower.includes(palabra));
  return match || null;
}


export default function NuevoArticuloMultipaso() {
  // Multipaso
  const [step, setStep] = useState(1);

  // Paso 1: Keywords, idiomas y categorías
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [idiomas, setIdiomas] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<{id: number, nombre: string, slug: string}[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [loadingCats, setLoadingCats] = useState(false);

  // Paso 2: Editor
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);

  // Auth, router y supabase
  const { user, supabase } = useAuth();
  const router = useRouter();

  // Imagen destacada
  const [imagenDestacada, setImagenDestacada] = useState<string | null>(null);
  const [modalImg, setModalImg] = useState<"galeria" | "upload" | "ia" | null>(null);

  // Galería de imágenes
  const [imagenesGaleria, setImagenesGaleria] = useState<any[]>([]);
  const [loadingGaleria, setLoadingGaleria] = useState(false);

  // Fetch de categorías al cargar
  useEffect(() => {
  const loadCats = async () => {
    setLoadingCats(true);
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } finally {
      setLoadingCats(false);
    }
  };
  loadCats();
}, []);


  // Cargar galería solo cuando se abre el modal
 useEffect(() => {
  if (modalImg === "galeria" && imagenesGaleria.length === 0 && user) {
    const cargarGaleria = async () => {
      setLoadingGaleria(true);
      try {
        const { data } = await supabase
          .from("imagenes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setImagenesGaleria(data || []);
      } finally {
        setLoadingGaleria(false);
      }
    };
    cargarGaleria();
  }
  // eslint-disable-next-line
}, [modalImg]);


  // Keywords e idiomas
  const addKeyword = () => {
    if (
      keywordInput.trim() &&
      !keywords.includes(keywordInput.trim()) &&
      keywords.length < 2
    ) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const toggleIdioma = (code: string) => {
    if (idiomas.includes(code)) {
      setIdiomas(idiomas.filter((i) => i !== code));
    } else {
      setIdiomas([...idiomas, code]);
    }
  };

  const puedePasar = keywords.length > 0 && idiomas.length > 0 && categoriaId !== null;

  // Guardar artículo
const handleSave = async (publicar = false) => {
  if (!user) {
    toast.error("Debes iniciar sesión.");
    return;
  }

  // --- Validación de contenido prohibido ---
  const prohibidaEnTitulo = contienePalabraProhibida(title);
  const prohibidaEnContenido = contienePalabraProhibida(content);
  const prohibidaEnKeyword = keywords.find(kw => contienePalabraProhibida(kw));
  if (prohibidaEnTitulo || prohibidaEnContenido || prohibidaEnKeyword) {
    toast.error(
      `Tu artículo contiene contenido prohibido (${prohibidaEnTitulo || prohibidaEnContenido || prohibidaEnKeyword}). Por favor, elimina esa palabra antes de continuar.`,
      { duration: 7000 }
    );
    return;
  }
  // --- Fin validación ---

  if (publicar) {
    // Consulta saldo antes de publicar
    const creditos = await getCreditosUsuario(user.id);
    if (creditos < 1) {
      toast.error(
        <span>
          No tienes créditos suficientes para publicar.<br />
          <Link href="/comprar-creditos" className="underline text-blue-600">Comprar créditos</Link>
        </span>,
        { duration: 6000 }
      );
      return;
    }
  }

  setSaving(true);
  try {
    // 1. Crear artículo
    await crearArticulo({
      user_id: user.id,
      titulo: title,
      contenido: content,
      keywords,
      idiomas,
      imagen_url: imagenDestacada, // <-- ¡Imagen destacada!
      estado: publicar ? "publicado" : "borrador",
      categoria_id: categoriaId!,
    });
    // 2. Si es publicar, descontar crédito
    if (publicar) await restarCredito(user.id);

    setSaving(false);
    setPublished(publicar);
    toast.success(publicar ? "¡Artículo publicado!" : "Borrador guardado");
    // Redirigir tras publicar
    if (publicar) setTimeout(() => router.push("/dashboard/articulos"), 1200);
  } catch (err) {
    setSaving(false);
    toast.error("Error al guardar el artículo");
  }
};


  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="pl-4 pt-8">
          {step === 1 ? (
            <Link
              href="/dashboard/articulos"
              className="flex items-center gap-2 text-gray-500 hover:text-black transition text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Atrás
            </Link>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-500 hover:text-black transition text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Volver
            </button>
          )}
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl mt-4 mb-12 bg-white rounded-2xl shadow-lg px-10 py-10 relative">

                    {/* INDICADOR MULTIPASO (STEPPER) */}
        <div className="flex items-center justify-center gap-0 mb-10 mt-2">
          <div className="flex items-center gap-2">
            <div className={`rounded-full h-7 w-7 flex items-center justify-center font-bold text-base border-2 ${step === 1 ? "bg-black text-white border-black" : "bg-gray-200 text-gray-700 border-gray-300"}`}>1</div>
            <span className={`ml-2 font-semibold ${step === 1 ? "text-black" : "text-gray-400"}`}>Seleccionar datos</span>
          </div>
          <div className={`w-10 h-0.5 mx-2 ${step === 2 ? "bg-black" : "bg-gray-300"}`}></div>
          <div className="flex items-center gap-2">
            <div className={`rounded-full h-7 w-7 flex items-center justify-center font-bold text-base border-2 ${step === 2 ? "bg-black text-white border-black" : "bg-gray-200 text-gray-700 border-gray-300"}`}>2</div>
            <span className={`ml-2 font-semibold ${step === 2 ? "text-black" : "text-gray-400"}`}>Editor y publicación</span>
          </div>
        </div>


            {/* ---------- Paso 1: Selección ---------- */}
            {step === 1 && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Tag size={28} className="text-blue-600" />
                  <h2 className="text-3xl font-bold">Nuevo artículo</h2>
                </div>
                <div className="mb-10 text-gray-500 text-base">
                  Selecciona tus keywords, el idioma, la categoría y el método de creación.
                </div>

                {/* Keywords */}
                <div className="mb-7">
                  <label className="block font-semibold mb-2 text-base">Keywords <span className="font-normal text-gray-400">(máx. 2)</span></label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Introduce una keyword"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                      className="p-3 border rounded-lg w-64 text-base"
                      maxLength={40}
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      disabled={!keywordInput.trim() || keywords.length >= 2}
                      className="bg-black text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-300"
                    >
                      Añadir
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="bg-gray-200 rounded-lg px-3 py-1 flex items-center gap-2 text-sm"
                      >
                        {kw}
                        <button
                          onClick={() => removeKeyword(kw)}
                          className="ml-1 text-gray-500 hover:text-red-500"
                          title="Quitar"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Ejemplos:{" "}
                    {keywordExamples.map((ex, i) => (
                      <span
                        key={i}
                        className="underline cursor-pointer text-blue-600 mr-2"
                        onClick={() =>
                          keywords.length < 2 && !keywords.includes(ex)
                            ? setKeywords([...keywords, ex])
                            : null
                        }
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Idiomas */}
                <div className="mb-7">
                  <label className="block font-semibold mb-2 text-base">Idioma(s)</label>
                  <div className="flex gap-6 flex-wrap">
                    {idiomasDisponibles.map((idioma) => (
                      <label key={idioma.code} className="flex items-center gap-2 text-base">
                        <input
                          type="checkbox"
                          checked={idiomas.includes(idioma.code)}
                          onChange={() => toggleIdioma(idioma.code)}
                          className="accent-black"
                        />
                        {idioma.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categoría */}
                <div className="mb-10">
                  <label className="block font-semibold mb-2 text-base">Categoría</label>
                  {loadingCats ? (
                    <div className="text-gray-500 text-sm">Cargando categorías...</div>
                  ) : (
                    <select
                      value={categoriaId || ''}
                      onChange={e => setCategoriaId(Number(e.target.value))}
                      className="p-3 border rounded-lg w-64 text-base"
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Acciones paso 1 */}
                <div className="flex gap-6 justify-center">
                  <button
                    className={`bg-blue-600 text-white px-7 py-4 rounded-xl font-bold text-base flex items-center gap-2 transition disabled:bg-gray-300`}
                    disabled={!puedePasar}
                    onClick={() => setStep(2)}
                  >
                    ✍️ Escribir a mano
                  </button>
                  <button
                    className={`bg-green-600 text-white px-7 py-4 rounded-xl font-bold text-base flex items-center gap-2 transition disabled:bg-gray-300`}
                    disabled={!puedePasar}
                    // Aquí luego iría setStep(3) para generación IA
                    onClick={() => alert("En la siguiente versión conectamos la generación IA 😉")}
                  >
                    <Sparkles size={22} /> Generar automáticamente
                  </button>
                </div>
              </>
            )}

            {/* ---------- Paso 2: Editor ---------- */}
            {step === 2 && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Tag size={28} className="text-blue-600" />
                  <h2 className="text-3xl font-bold">Editor de artículo</h2>
                </div>
                <div className="mb-10 text-gray-500 text-base">
                  Redacta tu artículo, dale formato y publícalo cuando quieras.
                </div>

                {/* Keywords, idiomas y categoría (no editables, solo visibles) */}
                <div className="mb-6 flex flex-wrap gap-8">
                  <div>
                    <div className="font-semibold text-sm mb-1 text-gray-500">Keywords</div>
                    <div className="flex gap-2">
                      {keywords.map((kw) => (
                        <span key={kw} className="bg-gray-200 rounded px-3 py-1 text-sm">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1 text-gray-500">Idioma(s)</div>
                    <div className="flex gap-2">
                      {idiomas.map((idioma) => (
                        <span key={idioma} className="bg-gray-200 rounded px-3 py-1 text-sm uppercase">
                          {idioma}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1 text-gray-500">Categoría</div>
                    <div className="flex gap-2">
                      {categorias
                        .filter(cat => cat.id === categoriaId)
                        .map(cat => (
                          <span key={cat.id} className="bg-gray-200 rounded px-3 py-1 text-sm">
                            {cat.nombre}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Título del artículo"
                    className="w-full p-3 rounded-lg border text-lg font-semibold"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Editor WYSIWYG */}
                <div className="mb-8">
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    placeholder="Escribe tu artículo aquí..."
                    className="bg-white"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                    formats={[
                      'header', 'bold', 'italic', 'underline',
                      'list', 'bullet', 'link', 'image'
                    ]}
                    style={{ minHeight: 180 }}
                  />
                </div>

                {/* Imagen destacada */}
                <div className="mb-8">
                  <label className="font-semibold mb-2 block">Imagen destacada</label>
                  {imagenDestacada ? (
                    <div className="relative inline-block mb-3">
                      <img src={imagenDestacada} alt="Imagen destacada" className="rounded-xl w-60 h-40 object-cover border" />
                      <button
                        className="absolute top-2 right-2 bg-white/80 hover:bg-red-500 hover:text-white text-gray-800 p-1 rounded-full shadow"
                        onClick={() => setImagenDestacada(null)}
                        title="Quitar imagen"
                      >×</button>
                    </div>
                  ) : (
                    <div className="flex gap-3 mb-2">
                      <button
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition"
                        onClick={() => setModalImg("galeria")}
                      >
                        Elegir de galería
                      </button>
                      <button
                        className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition"
                        onClick={() => setModalImg("upload")}
                      >
                        Subir imagen
                      </button>
                      <button
                        className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-200 transition"
                        onClick={() => setModalImg("ia")}
                      >
                        Crear con IA
                      </button>
                    </div>
                  )}
                </div>

                {/* Botones */}
                <div className="flex gap-6 justify-end">
                  <button
                    className="px-6 py-3 rounded-lg font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    disabled={saving}
                    onClick={() => handleSave(false)}
                  >
                    Guardar como borrador
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 transition"
                    disabled={saving || !title || !content}
                    onClick={() => handleSave(true)}
                  >
                    {saving ? "Publicando..." : "Publicar"}
                  </button>
                </div>

                {/* Mensaje de éxito */}
                {published && (
                  <div className="mt-6 text-green-600 font-medium text-center">
                    ¡Artículo publicado con éxito!
                  </div>
                )}
              </>
            )}

            {/* ----- MODALES DE IMAGEN DESTACADA ------ */}
            {modalImg === "galeria" && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
                  <button className="absolute top-3 right-4 text-gray-400 hover:text-black" onClick={() => setModalImg(null)}>✕</button>
                  <h3 className="text-xl font-bold mb-6">Elige una imagen de tu galería</h3>
                  {loadingGaleria ? (
                    <div className="text-gray-500 py-8 text-center">Cargando…</div>
                  ) : imagenesGaleria.length === 0 ? (
                    <div className="text-gray-400 py-8 text-center">No tienes imágenes aún.</div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {imagenesGaleria.map(img => (
                        <img
                          key={img.id}
                          src={img.url}
                          alt={img.title || "Imagen"}
                          className="w-36 h-28 object-cover rounded-xl border cursor-pointer hover:ring-2 ring-blue-400"
                          onClick={() => {
                            setImagenDestacada(img.url);
                            setModalImg(null);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {modalImg === "upload" && (
              <SubirImagenModal
                user={user}
                supabase={supabase}
                onSuccess={(url: string) => { setImagenDestacada(url); setModalImg(null); }}
                onClose={() => setModalImg(null)}
              />
            )}

            {modalImg === "ia" && (
              <CrearImagenIAModal
                user={user}
                supabase={supabase}
                onSuccess={(url: string) => { setImagenDestacada(url); setModalImg(null); }}
                onClose={() => setModalImg(null)}
              />
            )}

          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// ------- MODALES AUXILIARES --------

// SUBIR IMAGEN MODAL
function SubirImagenModal({ user, supabase, onSuccess, onClose }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileRef.current?.files?.[0]) return;
    setUploading(true);
    setError(null);
    const file = fileRef.current.files[0];
    const ext = file.name.split('.').pop();
    const filename = `${user.id}/${Date.now()}.${ext}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("imagenes")
      .upload(filename, file, { cacheControl: "3600", upsert: false });
    if (storageError) {
      setError("Error subiendo imagen: " + storageError.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("imagenes").getPublicUrl(filename);
    const publicUrl = urlData?.publicUrl;
    if (publicUrl) onSuccess(publicUrl);
    setUploading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
      <button className="absolute top-3 right-4 text-gray-400 hover:text-black" onClick={onClose}>✕</button>
      <h3 className="text-xl font-bold mb-6">Subir imagen</h3>
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
          className="bg-black text-white w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          {uploading ? "Subiendo…" : "Subir"}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  );
}

// GENERAR IMAGEN IA MODAL
function CrearImagenIAModal({ user, supabase, onSuccess, onClose }: any) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);

    // Llama a tu endpoint SD ya preparado
    const res = await fetch("/api/sd-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
      setError("Error generando la imagen IA.");
      setGenerating(false);
      return;
    }
    const { imageUrl } = await res.json();
    if (!imageUrl) {
      setError("No se pudo obtener la imagen generada.");
      setGenerating(false);
      return;
    }

    // Descarga la imagen y súbela a storage
    const imageBlob = await fetch(imageUrl).then(r => r.blob());
    const ext = "png";
    const filename = `${user.id}/ai-${Date.now()}.${ext}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("imagenes")
      .upload(filename, imageBlob, { cacheControl: "3600", upsert: false, contentType: "image/png" });
    if (storageError) {
      setError("Error subiendo imagen: " + storageError.message);
      setGenerating(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("imagenes").getPublicUrl(filename);
    const publicUrl = urlData?.publicUrl;
    if (publicUrl) onSuccess(publicUrl);
    setGenerating(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
      <button className="absolute top-3 right-4 text-gray-400 hover:text-black" onClick={onClose}>✕</button>
      <h3 className="text-xl font-bold mb-6">Crear imagen con IA</h3>
      <form className="space-y-5" onSubmit={handleAIGenerate}>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe la imagen a crear"
          className="block w-full border rounded-lg p-2"
          required
          disabled={generating}
        />
        <button
          type="submit"
          disabled={generating}
          className="bg-purple-600 text-white w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          {generating ? "Generando…" : "Crear con IA"}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  );
}
