CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  icon       TEXT,
  color      TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial categories
INSERT INTO categories (name, slug, icon, color) VALUES
  ('Gastronomía',  'gastronomia', '🍽️', '#ef4444'),
  ('Ropa',         'ropa',        '👗', '#8b5cf6'),
  ('Servicios',    'servicios',   '🔧', '#3b82f6'),
  ('Belleza',      'belleza',   👄  ,'#f43f5e'),
  ('Tecnología',   'tecnologia',  '💻', '#06b6d4'),
  ('Deportes',     'deportes',    '⚽', '#10b981'),
  ('Hogar',        'hogar',       '🏠', '#f59e0b'),
  ('Salud',        'salud',       '💊', '#84cc16'),
  ('Otros',        'otros',       '🏷️', '#6b7280');
