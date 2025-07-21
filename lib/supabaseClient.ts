// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uwwlcvfjbipgndhkjjkm.supabase.co"; // 👉 cámbialo
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3d2xjdmZqYmlwZ25kaGtqamttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjczNTYsImV4cCI6MjA2NzU0MzM1Nn0.72O8AGkeEmta29L1PcQO-sXTyaFNfQiIEicXMVYa_Lc"; // 👉 cámbialo

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
