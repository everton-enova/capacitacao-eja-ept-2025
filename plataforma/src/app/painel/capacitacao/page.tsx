import { getSession } from '@/lib/auth'
import TabelaInscricoes from './TabelaInscricoes'

export const dynamic = 'force-dynamic'

export default async function CapacitacaoPage() {
  const session = await getSession()
  if (!session) return null

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">Capacitação</h1>
        <p className="text-sm text-gray-500 mt-1">
          {session?.role === 'territorial'
            ? `Inscrições do ${session.nte}`
            : 'Todas as inscrições da equipe de campo'}
        </p>
      </div>
      <TabelaInscricoes role={session!.role} nte={session!.nte} />
    </div>
  )
}
