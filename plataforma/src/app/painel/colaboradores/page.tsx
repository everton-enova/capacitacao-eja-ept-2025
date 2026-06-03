import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import GerenciarColaboradores from './GerenciarColaboradores'

export default async function PainelColaboradores() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'master') redirect('/painel')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">Colaboradores</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie os colaboradores com acesso ao painel</p>
      </div>
      <GerenciarColaboradores />
    </div>
  )
}
