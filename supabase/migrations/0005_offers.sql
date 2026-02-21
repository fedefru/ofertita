CREATE TABLE offers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id    UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  original_price NUMERIC(10, 2) NOT NULL,
  offer_price    NUMERIC(10, 2) NOT NULL,
  discount_pct   NUMERIC(5, 2) GENERATED ALWAYS AS (
    ROUND(((original_price - offer_price) / original_price) * 100, 2)
  ) STORED,
  image_url      TEXT,
  start_date     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date       TIMESTAMPTZ NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  view_count     INT NOT NULL DEFAULT 0,
  save_count     INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_price CHECK (offer_price < original_price),
  CONSTRAINT valid_price_positive CHECK (offer_price > 0 AND original_price > 0),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

CREATE INDEX idx_offers_business_id ON offers(business_id);
CREATE INDEX idx_offers_end_date ON offers(end_date);
CREATE INDEX idx_offers_is_active ON offers(is_active);

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
