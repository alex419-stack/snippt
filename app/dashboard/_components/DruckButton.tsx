'use client'

export function DruckButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-[14px] border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-[14px] font-medium text-snippt-ink hover:bg-white/[0.08] print:hidden"
    >
      Schild drucken
    </button>
  )
}
