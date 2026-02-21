CREATE TABLE saved_offers (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_id   UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, offer_id)
);

CREATE INDEX idx_saved_offers_user_id ON saved_offers(user_id);
CREATE INDEX idx_saved_offers_offer_id ON saved_offers(offer_id);

-- Increment save_count when a user saves an offer
CREATE OR REPLACE FUNCTION increment_save_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE offers SET save_count = save_count + 1 WHERE id = NEW.offer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_offer_saved
  AFTER INSERT ON saved_offers
  FOR EACH ROW EXECUTE FUNCTION increment_save_count();

-- Decrement save_count when a user unsaves an offer
CREATE OR REPLACE FUNCTION decrement_save_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE offers SET save_count = GREATEST(save_count - 1, 0) WHERE id = OLD.offer_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_offer_unsaved
  AFTER DELETE ON saved_offers
  FOR EACH ROW EXECUTE FUNCTION decrement_save_count();

-- get_nearby_offers RPC function
CREATE OR REPLACE FUNCTION get_nearby_offers(
  user_lat        DOUBLE PRECISION,
  user_lng        DOUBLE PRECISION,
  radius_meters   INT DEFAULT 5000,
  filter_category TEXT DEFAULT NULL,
  limit_count     INT DEFAULT 20,
  offset_count    INT DEFAULT 0
)
RETURNS TABLE (
  id             UUID,
  title          TEXT,
  description    TEXT,
  original_price NUMERIC,
  offer_price    NUMERIC,
  discount_pct   NUMERIC,
  image_url      TEXT,
  start_date     TIMESTAMPTZ,
  end_date       TIMESTAMPTZ,
  view_count     INT,
  save_count     INT,
  business_id    UUID,
  business_name  TEXT,
  business_slug  TEXT,
  business_logo  TEXT,
  business_lat   DOUBLE PRECISION,
  business_lng   DOUBLE PRECISION,
  category_name  TEXT,
  category_slug  TEXT,
  category_color TEXT,
  distance_meters DOUBLE PRECISION
) AS $$
DECLARE
  user_point GEOGRAPHY;
BEGIN
  user_point := ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography;

  RETURN QUERY
  SELECT
    o.id,
    o.title,
    o.description,
    o.original_price,
    o.offer_price,
    o.discount_pct,
    o.image_url,
    o.start_date,
    o.end_date,
    o.view_count,
    o.save_count,
    b.id AS business_id,
    b.name AS business_name,
    b.slug AS business_slug,
    b.logo_url AS business_logo,
    b.lat AS business_lat,
    b.lng AS business_lng,
    c.name AS category_name,
    c.slug AS category_slug,
    c.color AS category_color,
    ST_Distance(b.location, user_point) AS distance_meters
  FROM offers o
  JOIN businesses b ON o.business_id = b.id
  JOIN categories c ON b.category_id = c.id
  WHERE
    o.is_active = TRUE
    AND o.end_date >= NOW()
    AND o.start_date <= NOW()
    AND b.is_active = TRUE
    AND ST_DWithin(b.location, user_point, radius_meters)
    AND (filter_category IS NULL OR c.slug = filter_category)
  ORDER BY distance_meters ASC, o.discount_pct DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
