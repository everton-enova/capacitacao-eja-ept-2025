import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Colaborador } from '@/models/Colaborador'
import { getSession } from '@/lib/auth'

async function checkAccess() {
  const session = await getSession()
  if (!session || (session.role !== 'master' && session.role !== 'subcoordenador')) return null
  return session
}

export async function GET() {
  const session = await checkAccess()
  if (!session) return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })

  await connectDB()

  // Join com inscrições para trazer dados pessoais e bancários
  const lista = await Colaborador.aggregate([
    ...(session.role === 'subcoordenador'
      ? [{ $match: { funcao: 'Coordenador Territorial' } }]
      : []),
    { $lookup: { from: 'inscricaos', localField: 'cpf', foreignField: 'cpf', as: 'insc' } },
    { $addFields: { inscricao: { $arrayElemAt: ['$insc', 0] } } },
    { $project: { insc: 0 } },
    { $sort: { nome: 1 } },
  ])

  return NextResponse.json({ lista, sessionCpf: session.cpf, role: session.role })
}

export async function POST(req: NextRequest) {
  const session = await checkAccess()
  if (!session || session.role !== 'master') return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  const data = await req.json()
  await connectDB()
  const colaborador = await Colaborador.create(data)
  return NextResponse.json(colaborador, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await checkAccess()
  if (!session) return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })

  const body = await req.json()
  await connectDB()

  if (body.action === 'vincular') {
    await Colaborador.findByIdAndUpdate(body.id, { subcoordenadorCpf: session.cpf })
  } else if (body.action === 'desvincular') {
    await Colaborador.findByIdAndUpdate(body.id, { subcoordenadorCpf: '' })
  } else {
    // toggle ativo — só master
    if (session.role !== 'master') return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
    await Colaborador.findByIdAndUpdate(body.id, { ativo: body.ativo })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await checkAccess()
  if (!session || session.role !== 'master') return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  const { id } = await req.json()
  await connectDB()
  await Colaborador.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
