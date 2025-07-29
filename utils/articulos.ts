import { supabase } from '../lib/supabaseClient';

export async function crearArticulo({
  user_id,
  titulo,
  contenido,
  keywords,
  idiomas,
  imagen_url,
  estado,
  categoria_id,
}: {
  user_id: string,
  titulo: string,
  contenido: string,
  keywords: string[],
  idiomas: string[],
  imagen_url?: string | null,
  estado: string,
  categoria_id: number,
}) {
  const { data, error } = await supabase
    .from('articulos')
    .insert([
      {
        user_id,
        titulo,
        contenido,
        keywords,
        idiomas,
        imagen_url,
        estado,
        categoria_id,
      }
    ])
    .single();
  if (error) throw error;
  return data;
}
