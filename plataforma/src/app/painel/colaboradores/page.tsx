import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import GerenciarColaboradores from './GerenciarColaboradores'

export default async function PainelColaboradores() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'territorial') redirect('/painel')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">Colaboradores</h1>
        <p className="text-sm text-gray-500 mt-1">
          {session.role === 'master'
            ? 'Gerencie todos os colaboradores com acesso ao painel'
            : 'Vincule Coordenadores Territoriais ao seu acesso'}
        </p>
      </div>
      <GerenciarColaboradores role={session.role} sessionCpf={session.cpf} />
    </div>
  )
}
