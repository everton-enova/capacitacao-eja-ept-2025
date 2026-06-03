'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'
import type { SessionUser } from '@/lib/auth'

const iconDashboard = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
  </svg>
)
const iconCapacitacao = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)
const iconPerfil = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
const iconColaboradores = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

interface Props { session: SessionUser }

export default function Sidebar({ session }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/painel', label: 'Dashboard', icon: iconDashboard, roles: ['master', 'subcoordenador', 'territorial'] },
    { href: '/painel/capacitacao', label: 'Capacitação', icon: iconCapacitacao, roles: ['master', 'subcoordenador', 'territorial'] },
    { href: '/painel/colaboradores', label: 'Colaboradores', icon: iconColaboradores, roles: ['master', 'subcoordenador'] },
    { href: '/painel/perfil', label: 'Meu Perfil', icon: iconPerfil, roles: ['master', 'subcoordenador', 'territorial'] },
  ].filter(l => l.roles.includes(session.role))

  function NavLinks({ onClick }: { onClick?: () => void }) {
    return (
      <nav className="flex-1 space-y-1">
        {links.map(l => {
          const active = pathname === l.href
          return (
            <Link key={l.href} href={l.href} onClick={onClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}>
              {l.icon}
              {l.label}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <>
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/brasao_estado.png" alt="" width={28} height={28} />
          <span className="text-white text-sm font-semibold">SABE 2025</span>
        </div>
        <button onClick={() => setOpen(o => !o)} className="text-white/70 hover:text-white p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-20 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 z-20 bg-gray-900 flex flex-col p-5 pt-16 transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavLinks onClick={() => setOpen(false)} />
        <div className="border-t border-white/10 pt-4 mt-4 space-y-1">
          <p className="text-xs text-white/40 truncate">{session.nome}</p>
          <p className="text-xs text-white/25">{session.funcao}</p>
          <div className="pt-2"><LogoutButton /></div>
        </div>
      </aside>

      {/* Desktop sidebar — fixo */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-gray-900 flex-col p-5 z-20">
        <div className="flex items-center gap-3 mb-8">
          <Image src="/brasao_estado.png" alt="Estado da Bahia" width={36} height={36} />
          <div>
            <p className="text-white text-sm font-bold leading-tight">SABE 2025</p>
            <p className="text-white/40 text-xs">Equipe de Campo</p>
          </div>
        </div>

        <NavLinks />

        <div className="border-t border-white/10 pt-4 mt-4 space-y-1">
          <p className="text-xs text-white/60 font-medium truncate">{session.nome}</p>
          <p className="text-xs text-white/30">{session.funcao}</p>
          {session.nte && <p className="text-xs text-white/25">{session.nte}</p>}
          <div className="pt-2"><LogoutButton /></div>
        </div>
      </aside>
    </>
  )
}
