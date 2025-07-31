import { supabase } from "@/utils/supabaseClient";
import { Database } from "@/types/supabase";

export type Keyword = Database["public"]["Tables"]["keywords"]["Row"];

export async function fetchUserKeywords(user_id: string): Promise<Keyword[]> {
  const { data, error } = await supabase
    .from("keywords")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Keyword[];
}

export async function saveKeyword(user_id: string, keyword: string): Promise<Keyword | null> {
  const { data, error } = await supabase
    .from("keywords")
    .insert([{ user_id, keyword }])
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    return null;
  }

  return data[0] as Keyword;
}

export async function deleteKeyword(id: string): Promise<void> {
  const { error } = await supabase
    .from("keywords")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
