INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  last_login
) VALUES (
  'user_id',
  'gmail',
  'full_name',
  'teacher',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  last_login = EXCLUDED.last_login;



26ba8b13-f279-4139-8989-dc4318de6f8a