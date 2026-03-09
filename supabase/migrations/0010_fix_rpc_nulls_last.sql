-- Migration: fix get_nearby_offers ORDER BY to use NULLS LAST for discount_pct.
-- After migration 0009 made prices optional, discount_pct can be NULL.
-- PostgreSQL default for DESC ordering is NULLS FIRST, which incorrectly
-- bubbles promo-style offers (no price = null discount) above discounted offers.

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
  ORDER BY distance_meters ASC, o.discount_pct DESC NULLS LAST
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
