import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: friseur } = await supabase
    .from('friseur')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">
          Hallo, {friseur?.name ?? 'Friseur'} 👋
        </h1>
        <p className="text-muted-foreground mb-8">
          Deine Buchungs-URL:{' '}
          <a
            href={`/${friseur?.slug}`}
            className="underline font-medium"
            target="_blank"
          >
            /{friseur?.slug}
          </a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Termine heute</p>
            <p className="text-3xl font-bold mt-1">—</p>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Stammkunden</p>
            <p className="text-3xl font-bold mt-1">—</p>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Diese Woche</p>
            <p className="text-3xl font-bold mt-1">—</p>
          </div>
        </div>
      </div>
    </div>
  )
}
