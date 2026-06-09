-- ============================================================
-- Migration 006 — Speicherplatz für Friseur-Profilfotos
-- Öffentlich lesbarer Bucket; Schreibzugriff nur auf den eigenen Ordner (user_id).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('friseur-fotos', 'friseur-fotos', true)
on conflict (id) do nothing;

-- Hochladen: nur in den eigenen Ordner (erster Pfad-Teil = eigene user_id)
create policy "Friseur laedt eigenes Foto hoch"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'friseur-fotos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Friseur aktualisiert eigenes Foto"
  on storage.objects for update to authenticated
  using (bucket_id = 'friseur-fotos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Friseur loescht eigenes Foto"
  on storage.objects for delete to authenticated
  using (bucket_id = 'friseur-fotos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Öffentliches Lesen (Kunden-Seite)
create policy "Friseur-Fotos oeffentlich lesbar"
  on storage.objects for select
  using (bucket_id = 'friseur-fotos');
