import { supabase } from '../lib/supabaseClient';

export async function fetchCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre, slug')
    .order('nombre', { ascending: true });
  if (error) throw error;
  return data;
}
