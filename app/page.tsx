import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Snippt</h1>
        <p className="text-muted-foreground text-lg">
          Buche deinen Lieblingsfriseuer — schnell, einfach, ohne Anruf.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button asChild>
            <Link href="/register">Jetzt starten</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Anmelden</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
