import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import GerenciarColaboradores from './GerenciarColaboradores'
import LogoutButton from '@/components/LogoutButton'

export default async function PainelColaboradores() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'master') redirect('/painel/inscricoes')

  return (
    <main className="min-h-screen bg-[#e8e8e8]">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">SABE 2025 — Capacitação Equipe de Campo</p>
          <h1 className="text-lg font-bold text-gray-900">Colaboradores</h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="/painel/inscricoes" className="text-xs text-gray-500 hover:text-gray-900">← Inscrições</a>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-xs text-gray-500 hover:text-gray-900">Sair</button>
          </form>
        </div>
      </header>
      <div className="p-6">
        <GerenciarColaboradores />
      </div>
    </main>
  )
}
