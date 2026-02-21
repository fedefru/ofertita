-- =============================================
-- Enable Row Level Security on all tables
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_offers ENABLE ROW LEVEL SECURITY;

-- =============================================
-- profiles
-- =============================================
CREATE POLICY "profiles_select_authenticated"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- categories (reference data — public read)
-- =============================================
CREATE POLICY "categories_select_public"
  ON categories FOR SELECT
  USING (TRUE);

-- =============================================
-- businesses
-- =============================================
-- Any authenticated user can view active businesses
CREATE POLICY "businesses_select_active"
  ON businesses FOR SELECT
  USING (is_active = TRUE AND auth.uid() IS NOT NULL);

-- Owners can view their own businesses even if inactive
CREATE POLICY "businesses_select_own"
  ON businesses FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "businesses_insert_own"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "businesses_update_own"
  ON businesses FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "businesses_delete_own"
  ON businesses FOR DELETE
  USING (auth.uid() = owner_id);

-- =============================================
-- offers
-- =============================================
-- Authenticated users can see active, non-expired offers
CREATE POLICY "offers_select_active"
  ON offers FOR SELECT
  USING (
    is_active = TRUE
    AND end_date >= NOW()
    AND auth.uid() IS NOT NULL
  );

-- Owners can see all their own offers (including expired/inactive)
CREATE POLICY "offers_select_own"
  ON offers FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- Only the business owner can create offers for their businesses
CREATE POLICY "offers_insert_own"
  ON offers FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "offers_update_own"
  ON offers FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "offers_delete_own"
  ON offers FOR DELETE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- =============================================
-- saved_offers
-- =============================================
CREATE POLICY "saved_offers_select_own"
  ON saved_offers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "saved_offers_insert_own"
  ON saved_offers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_offers_delete_own"
  ON saved_offers FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- Storage buckets
-- =============================================
-- Buckets must be created manually in Supabase dashboard (Storage > New bucket)
-- or via the SQL below (skip if already created):
--
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES
--   ('offer-images',    'offer-images',    TRUE, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
--   ('business-assets', 'business-assets', TRUE, 2097152, ARRAY['image/jpeg','image/png','image/webp']);

CREATE POLICY "offer-images_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'offer-images');

CREATE POLICY "offer-images_insert_auth"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'offer-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "offer-images_update_own"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'offer-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "offer-images_delete_own"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'offer-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "business-assets_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-assets');

CREATE POLICY "business-assets_insert_auth"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'business-assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "business-assets_update_own"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'business-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "business-assets_delete_own"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'business-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
