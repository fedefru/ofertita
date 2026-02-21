-- Increments view_count on an offer atomically.
-- Called server-side on every detail page visit (fire-and-forget).
create or replace function increment_view_count(offer_id uuid)
returns void
language sql
security definer
as $$
  update offers
  set view_count = view_count + 1
  where id = offer_id;
$$;
