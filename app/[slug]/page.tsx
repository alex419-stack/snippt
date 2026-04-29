import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BuchungsPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: friseur } = await supabase
    .from('friseur')
    .select('id, name, slug, foto_url, bio')
    .eq('slug', slug)
    .single()

  if (!friseur) notFound()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Friseur-Profil */}
        <div className="text-center">
          {friseur.foto_url ? (
            <img
              src={friseur.foto_url}
              alt={friseur.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
              {friseur.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-bold">{friseur.name}</h1>
          {friseur.bio && (
            <p className="text-muted-foreground mt-1 text-sm">{friseur.bio}</p>
          )}
        </div>

        {/* Buchungs-Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Termin buchen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Die Online-Buchung wird gerade eingerichtet. Melde dich direkt beim Friseur.
            </p>
            <Button className="w-full" disabled>
              Online-Buchung kommt bald
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: friseur } = await supabase
    .from('friseur')
    .select('name')
    .eq('slug', slug)
    .single()

  return {
    title: friseur ? `${friseur.name} — Termin buchen` : 'Friseur nicht gefunden',
  }
}
