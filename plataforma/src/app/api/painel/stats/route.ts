import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Inscricao } from '@/models/Inscricao'
import { Colaborador } from '@/models/Colaborador'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  await connectDB()

  const filtro = session.role === 'territorial' ? { nte: session.nte } : {}

  const [
    totalInscricoes,
    comHospedagem,
    porFuncao,
    totalColaboradores,
    colaboradoresAtivos,
  ] = await Promise.all([
    Inscricao.countDocuments(filtro),
    Inscricao.countDocuments({ ...filtro, hospedagem: 'Sim' }),
    Inscricao.aggregate([
      { $match: filtro },
      { $group: { _id: '$funcao', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]),
    Colaborador.countDocuments(session.role === 'territorial' ? { nte: session.nte } : {}),
    Colaborador.countDocuments({ ...(session.role === 'territorial' ? { nte: session.nte } : {}), ativo: true }),
  ])

  return NextResponse.json({
    totalInscricoes,
    comHospedagem,
    porFuncao,
    totalColaboradores,
    colaboradoresAtivos,
  })
}
