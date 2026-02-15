DO NOT PASTE THIS FILE INTO SUPABASE. This is instructions only, not SQL. You will get an error.

Only paste the contents of the two .sql files below, one at a time.

-------------------------------------------------------------------------------
STEP 1 - Run first
-------------------------------------------------------------------------------
1. Open the file:  create_profiles_table.sql
2. Select ALL text in that file (Cmd+A or Ctrl+A)
3. Copy and paste into Supabase Dashboard → SQL Editor
4. Click Run

-------------------------------------------------------------------------------
STEP 2 - Run second (only after Step 1 succeeded)
-------------------------------------------------------------------------------
1. Open the file:  rls_lessons_activities_year_groups.sql
2. Select ALL text in that file (Cmd+A or Ctrl+A)
3. Copy and paste into Supabase Dashboard → SQL Editor
4. Click Run

Files to use:  create_profiles_table.sql   and   rls_lessons_activities_year_groups.sql
Do not copy from this README or any .md file.

-------------------------------------------------------------------------------
STEP 3 (optional) - If year group delete fails with "Failed to delete year group"
-------------------------------------------------------------------------------
1. Open the file:  year_groups_rls_allow_authenticated_delete.sql
2. Select ALL text in that file (Cmd+A or Ctrl+A)
3. Copy and paste into Supabase Dashboard → SQL Editor
4. Click Run

This adds a fallback policy so any authenticated user can delete year groups.

-------------------------------------------------------------------------------
STEP 4 (optional) - If Activity Library shows "0 activities" after local login
-------------------------------------------------------------------------------
1. Open the file:  activities_lessons_allow_anon_read.sql
2. Select ALL text in that file (Cmd+A or Ctrl+A)
3. Copy and paste into Supabase Dashboard → SQL Editor
4. Click Run

This allows reading activities/lessons when using local auth (no Supabase session).
