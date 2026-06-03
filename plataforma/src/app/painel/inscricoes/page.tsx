import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import TabelaInscricoes from './TabelaInscricoes'
import LogoutButton from '@/components/LogoutButton'

export default async function PainelInscricoes() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <main className="min-h-screen bg-[#e8e8e8]">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">SABE 2025 — Capacitação Equipe de Campo</p>
          <h1 className="text-lg font-bold text-gray-900">Inscrições</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{session.nome}</p>
            <p className="text-xs text-gray-500">{session.funcao}</p>
          </div>
          {session.role === 'master' && (
            <a href="/painel/colaboradores" className="text-xs bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition">
              Colaboradores
            </a>
          )}
          <LogoutButton />
        </div>
      </header>

      <div className="p-6">
        <TabelaInscricoes role={session.role} nte={session.nte} />
      </div>
    </main>
  )
}
