-- Commedia dell'arte – KS3 Drama: purchasable pack (🎭)
-- Run after create_activity_packs.sql. Can be purchased in-app; admin can assign to users.

INSERT INTO activity_packs (pack_id, name, description, price, icon, category_ids, is_active)
VALUES (
  'COMMEDIA_KS3_DRAMA',
  'Commedia dell''arte – KS3 Drama',
  'Full lesson packs ready to use. Complete lesson packs on Commedia dell''arte for KS3. Just download the pack and add the lessons straight into your built-in teaching calendar—no extra setup.',
  19.99,
  '🎭',
  ARRAY[]::TEXT[],
  true
)
ON CONFLICT (pack_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
