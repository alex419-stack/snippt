'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'friseur-fotos'
const MAX_MB = 5

export function FotoUpload({ userId, initialUrl }: { userId: string; initialUrl: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? '')
  const [busy, setBusy] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFehler(null)

    if (!file.type.startsWith('image/')) {
      setFehler('Bitte ein Bild auswählen.')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setFehler(`Bild ist zu groß (max. ${MAX_MB} MB).`)
      return
    }

    setBusy(true)
    const supabase = createClient()
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${userId}/avatar-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      upsert: true,
      cacheControl: '3600',
    })
    if (error) {
      setFehler('Upload hat nicht geklappt. Versuch es nochmal.')
      setBusy(false)
      return
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    setUrl(data.publicUrl)
    setBusy(false)
  }

  return (
    <div>
      {/* wird vom Profil-Formular mitgespeichert */}
      <input type="hidden" name="foto_url" value={url} />

      <div className="flex items-center gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Profilfoto"
            className="h-[68px] w-[68px] rounded-[18px] object-cover"
            style={{ boxShadow: '0 0 0 1px rgba(255,255,255,.12)' }}
          />
        ) : (
          <div className="grid h-[68px] w-[68px] place-items-center rounded-[18px] border border-white/[0.1] bg-white/[0.03] text-snippt-faint">
            kein Foto
          </div>
        )}

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-[12px] border border-white/[0.12] bg-white/[0.04] px-4 py-[10px] text-[14px] text-snippt-ink hover:border-snippt-glow1/60 disabled:opacity-50"
          >
            {busy ? 'Lädt …' : url ? 'Foto ändern' : 'Foto hochladen'}
          </button>
          {fehler && <p className="text-[12px] text-snippt-weg">{fehler}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          className="hidden"
        />
      </div>
    </div>
  )
}
