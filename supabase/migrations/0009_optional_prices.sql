-- Migration: make offer prices optional to support promo-style offers
-- (e.g. "10% de descuento pagando en efectivo") with no fixed price.

-- 1. Drop the generated column (can't alter it in-place in PostgreSQL)
ALTER TABLE offers DROP COLUMN IF EXISTS discount_pct;

-- 2. Remove NOT NULL constraints from price columns
ALTER TABLE offers ALTER COLUMN original_price DROP NOT NULL;
ALTER TABLE offers ALTER COLUMN offer_price    DROP NOT NULL;

-- 3. Drop constraints that assume both prices are always present
ALTER TABLE offers DROP CONSTRAINT IF EXISTS valid_price;
ALTER TABLE offers DROP CONSTRAINT IF EXISTS valid_price_positive;

-- 4. Recreate discount_pct as a NULL-safe generated column
--    Returns NULL when either price is NULL (promo-type offers)
ALTER TABLE offers ADD COLUMN discount_pct NUMERIC(5, 2) GENERATED ALWAYS AS (
  CASE
    WHEN original_price IS NOT NULL
     AND offer_price    IS NOT NULL
     AND original_price > 0
    THEN ROUND(((original_price - offer_price) / original_price) * 100, 2)
    ELSE NULL
  END
) STORED;

-- 5. Re-add constraints that work with nullable prices
ALTER TABLE offers ADD CONSTRAINT valid_price
  CHECK (
    original_price IS NULL
    OR offer_price  IS NULL
    OR offer_price < original_price
  );

ALTER TABLE offers ADD CONSTRAINT valid_price_positive
  CHECK (offer_price    IS NULL OR offer_price    > 0);

ALTER TABLE offers ADD CONSTRAINT valid_original_price_positive
  CHECK (original_price IS NULL OR original_price > 0);
