import { useEffect, useState } from "react";
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

  // Auth y router
  const { user } = useAuth();
  const router = useRouter();

  // Fetch de categorías al cargar
  useEffect(() => {
    setLoadingCats(true);
    fetchCategorias()
      .then((data) => setCategorias(data))
      .finally(() => setLoadingCats(false));
  }, []);

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

  // Editor
  const handleSave = async (publicar = false) => {
    if (!user) {
      toast.error("Debes iniciar sesión.");
      return;
    }
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
        imagen_url: null,
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

          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
