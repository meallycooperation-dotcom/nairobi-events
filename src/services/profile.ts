import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { Profile } from "@/types";

export async function getProfileForCurrentUser(): Promise<Profile | null> {
  if (!isSupabaseEnabled) {
    return null;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Profile;
}
