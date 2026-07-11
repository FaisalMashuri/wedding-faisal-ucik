import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Jangan crash saat build; hanya peringatan agar env diisi sebelum fitur data dipakai.
  console.warn(
    "Supabase env belum diisi. Set NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local"
  );
}

// Fallback URL/key placeholder yang valid agar createClient tidak melempar error
// saat env belum diisi (request tetap gagal saat runtime, ditangani di UI).
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

