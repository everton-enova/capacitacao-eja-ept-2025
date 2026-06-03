import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Colaborador } from '@/models/Colaborador'
import { Inscricao } from '@/models/Inscricao'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  await connectDB()

  const [colaborador, inscricao] = await Promise.all([
    Colaborador.findOne({ cpf: session.cpf }).lean(),
    Inscricao.findOne({ cpf: session.cpf }).lean(),
  ])

  return NextResponse.json({ colaborador, inscricao })
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { nome, contato, email, banco, agencia, conta, tipoConta } = await req.json()

  await connectDB()

  await Promise.all([
    Colaborador.findOneAndUpdate({ cpf: session.cpf }, { nome }),
    Inscricao.findOneAndUpdate(
      { cpf: session.cpf },
      { nome, contato, email, banco, agencia, conta, tipoConta }
    ),
  ])

  return NextResponse.json({ ok: true })
}
