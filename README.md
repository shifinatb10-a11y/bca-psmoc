# Admin login note

- Admin login uses **Supabase Authentication → Users** email/password credentials (not old `ADMINS` entries).
- A successfully authenticated user is treated as admin only when their Auth user UUID exists in `public.admin_users` with a valid role (`super`, `media`, `finance`, or `events`).
- Do not store or share real passwords in this repository.
