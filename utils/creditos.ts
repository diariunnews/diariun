import { supabase } from "../lib/supabaseClient";

// Consulta el saldo actual de créditos
export async function getCreditosUsuario(user_id: string): Promise<number> {
  const { data, error } = await supabase
    .from('creditos_usuario')
    .select('creditos')
    .eq('user_id', user_id)
    .single();
  if (error || !data) return 0;
  return data.creditos;
}

// Descuenta un crédito usando la función SQL creada
export async function restarCredito(user_id: string): Promise<boolean> {
  const { error } = await supabase.rpc('restar_credito', { p_user_id: user_id });
  return !error;
}
