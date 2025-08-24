-- Fonction pour récupérer tous les utilisateurs depuis Supabase
-- À exécuter dans l'éditeur SQL Supabase : https://supabase.com/dashboard/project/xfbmdeuzuyixpmouhqcv/sql/new

-- Créer la fonction get_all_users
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  status TEXT,
  role TEXT,
  premium BOOLEAN,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Retourner les utilisateurs depuis la table profiles si elle existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RETURN QUERY
    SELECT 
      p.id,
      p.email,
      p.first_name,
      p.last_name,
      CASE 
        WHEN p.first_name IS NOT NULL AND p.last_name IS NOT NULL 
        THEN p.first_name || ' ' || p.last_name
        WHEN p.first_name IS NOT NULL 
        THEN p.first_name
        WHEN p.last_name IS NOT NULL 
        THEN p.last_name
        ELSE p.email
      END as full_name,
      COALESCE(p.status, 'active') as status,
      COALESCE(p.role, 'user') as role,
      COALESCE(p.premium, false) as premium,
      p.created_at,
      COALESCE(p.last_login, p.created_at) as last_sign_in_at
    FROM profiles p
    ORDER BY p.created_at DESC;
  ELSE
    -- Si la table profiles n'existe pas, retourner les utilisateurs depuis auth.users
    RETURN QUERY
    SELECT 
      au.id,
      au.email,
      au.raw_user_meta_data->>'first_name' as first_name,
      au.raw_user_meta_data->>'last_name' as last_name,
      CASE 
        WHEN au.raw_user_meta_data->>'first_name' IS NOT NULL AND au.raw_user_meta_data->>'last_name' IS NOT NULL 
        THEN (au.raw_user_meta_data->>'first_name') || ' ' || (au.raw_user_meta_data->>'last_name')
        WHEN au.raw_user_meta_data->>'first_name' IS NOT NULL 
        THEN au.raw_user_meta_data->>'first_name'
        WHEN au.raw_user_meta_data->>'last_name' IS NOT NULL 
        THEN au.raw_user_meta_data->>'last_name'
        ELSE au.email
      END as full_name,
      CASE 
        WHEN au.confirmed_at IS NOT NULL THEN 'active'
        ELSE 'inactive'
      END as status,
      COALESCE(au.raw_user_meta_data->>'role', 'user') as role,
      COALESCE((au.raw_user_meta_data->>'premium')::boolean, false) as premium,
      au.created_at,
      COALESCE(au.last_sign_in_at, au.created_at) as last_sign_in_at
    FROM auth.users au
    ORDER BY au.created_at DESC;
  END IF;
END;
$$;

-- Donner les permissions d'exécution à la fonction
GRANT EXECUTE ON FUNCTION get_all_users() TO anon;
GRANT EXECUTE ON FUNCTION get_all_users() TO authenticated;

-- Vérifier que la fonction a été créée
SELECT 
  routine_name, 
  routine_type, 
  data_type 
FROM information_schema.routines 
WHERE routine_name = 'get_all_users';


