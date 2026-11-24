-- Phase 1: profiles and role authorization.
-- Apply manually in the Supabase SQL Editor; this file is not applied by v0.
--
-- First administrator provisioning (one-time, after applying this migration):
-- 1. Create the intended administrator in Supabase Authentication > Users.
--    Do not use the current app sign-up form; it still uses mock authentication.
-- 2. Run this block in the SQL Editor after replacing the email with that
--    Auth user's exact email. It succeeds only when exactly one student profile
--    matches. Run it as the project database owner, not as an app user.
--
-- DO $bootstrap_admin$
-- DECLARE
--   v_updated integer;
-- BEGIN
--   UPDATE public.profiles
--   SET role = 'admin'
--   WHERE email = pg_catalog.lower(pg_catalog.btrim('replace-with-auth-user-email'))
--     AND role = 'student';
--
--   GET DIAGNOSTICS v_updated = ROW_COUNT;
--   IF v_updated <> 1 THEN
--     RAISE EXCEPTION 'Expected to promote exactly one student profile; updated % rows', v_updated;
--   END IF;
-- END;
-- $bootstrap_admin$;

BEGIN;

CREATE SCHEMA adigun_video_lab_private;
REVOKE ALL ON SCHEMA adigun_video_lab_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA adigun_video_lab_private TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

CREATE TYPE public.profile_role AS ENUM ('student', 'admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text,
  role public.profile_role NOT NULL DEFAULT 'student',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT pg_catalog.now(),
  updated_at timestamptz NOT NULL DEFAULT pg_catalog.now(),
  CONSTRAINT profiles_email_normalized CHECK (
    email IS NULL OR email = pg_catalog.lower(pg_catalog.btrim(email))
  ),
  CONSTRAINT profiles_avatar_url_length CHECK (
    avatar_url IS NULL OR pg_catalog.char_length(avatar_url) <= 2048
  )
);

CREATE UNIQUE INDEX profiles_email_lower_unique
  ON public.profiles (pg_catalog.lower(email))
  WHERE email IS NOT NULL;

COMMENT ON TABLE public.profiles IS
  'Application profile linked to Supabase Auth. Role changes are restricted to the admin RPC or trusted database administration.';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url) ON TABLE public.profiles TO authenticated;

CREATE FUNCTION adigun_video_lab_private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'::public.profile_role
  );
$function$;

REVOKE ALL ON FUNCTION adigun_video_lab_private.is_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION adigun_video_lab_private.is_admin() TO authenticated;

CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY profiles_select_admin
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT adigun_video_lab_private.is_admin()));

CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY profiles_update_admin
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT adigun_video_lab_private.is_admin()))
  WITH CHECK ((SELECT adigun_video_lab_private.is_admin()));

CREATE FUNCTION adigun_video_lab_private.set_profile_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at := pg_catalog.now();
  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION adigun_video_lab_private.set_profile_updated_at() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION adigun_video_lab_private.set_profile_updated_at();

CREATE FUNCTION adigun_video_lab_private.create_profile_for_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data ->> 'full_name'), ''),
      NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data ->> 'name'), ''),
      ''
    ),
    NULLIF(pg_catalog.lower(pg_catalog.btrim(NEW.email)), ''),
    'student'::public.profile_role
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION adigun_video_lab_private.create_profile_for_auth_user() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created_create_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION adigun_video_lab_private.create_profile_for_auth_user();

CREATE FUNCTION adigun_video_lab_private.sync_profile_email_from_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles
  SET email = NULLIF(pg_catalog.lower(pg_catalog.btrim(NEW.email)), '')
  WHERE id = NEW.id;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION adigun_video_lab_private.sync_profile_email_from_auth() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_email_changed_sync_profile
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION adigun_video_lab_private.sync_profile_email_from_auth();

-- Backfill Auth users that existed before this migration. The role is always
-- student here; user metadata is used only for display name, never authorization.
INSERT INTO public.profiles (id, full_name, email, role)
SELECT
  u.id,
  COALESCE(
    NULLIF(pg_catalog.btrim(u.raw_user_meta_data ->> 'full_name'), ''),
    NULLIF(pg_catalog.btrim(u.raw_user_meta_data ->> 'name'), ''),
    ''
  ),
  NULLIF(pg_catalog.lower(pg_catalog.btrim(u.email)), ''),
  'student'::public.profile_role
FROM auth.users AS u
ON CONFLICT (id) DO NOTHING;

CREATE FUNCTION public.admin_set_profile_role(
  p_user_id uuid,
  p_role public.profile_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_actor_id uuid := (SELECT auth.uid());
BEGIN
  IF v_actor_id IS NULL OR NOT (SELECT adigun_video_lab_private.is_admin()) THEN
    RAISE EXCEPTION 'Administrator privileges required'
      USING ERRCODE = '42501';
  END IF;

  IF p_user_id IS NULL OR p_role IS NULL THEN
    RAISE EXCEPTION 'User ID and role are required'
      USING ERRCODE = '22004';
  END IF;

  IF p_user_id = v_actor_id THEN
    RAISE EXCEPTION 'Administrators cannot change their own role'
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.profiles
  SET role = p_role
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found'
      USING ERRCODE = 'P0002';
  END IF;
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_set_profile_role(uuid, public.profile_role)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_profile_role(uuid, public.profile_role)
  TO authenticated;

COMMENT ON FUNCTION public.admin_set_profile_role(uuid, public.profile_role) IS
  'Allows an authenticated administrator to change another profile role; self-role changes are denied.';

COMMIT;
