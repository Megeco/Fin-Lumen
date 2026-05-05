import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const db = {
  getAll: async () => {
    const { data } = await supabase.from("stocks").select("*");
    return data;
  },

  get: async (name) => {
    const { data } = await supabase
      .from("stocks")
      .select("*")
      .eq("name", name)
      .single();
    return data;
  },

  upsert: async (row) => {
    await supabase.from("stocks").upsert(row);
  }
};
