import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Colaborador } from '@/models/Colaborador'
import { Inscricao } from '@/models/Inscricao'
import { getSession } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'master') return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })

  const { id } = await params
  await connectDB()

  const colaborador = await Colaborador.findById(id).lean()
  if (!colaborador) return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })

  const inscricao = await Inscricao.findOne({ cpf: (colaborador as any).cpf }).lean()
  return NextResponse.json({ colaborador, inscricao })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'master') return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  await connectDB()

  const colaborador = await Colaborador.findById(id)
  if (!colaborador) return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })

  await Colaborador.findByIdAndUpdate(id, {
    nome: body.nome, nte: body.nte,
  })

  await Inscricao.findOneAndUpdate(
    { cpf: colaborador.cpf },
    { nome: body.nome, contato: body.contato, email: body.email, banco: body.banco, agencia: body.agencia, conta: body.conta, tipoConta: body.tipoConta, nte: body.nte, municipio: body.municipio }
  )

  return NextResponse.json({ ok: true })
}
