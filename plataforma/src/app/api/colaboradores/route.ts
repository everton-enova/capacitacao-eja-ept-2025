import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Colaborador } from '@/models/Colaborador'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'master') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  }
  await connectDB()
  const lista = await Colaborador.find().sort({ nome: 1 }).lean()
  return NextResponse.json(lista)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'master') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  }
  const data = await req.json()
  await connectDB()
  const colaborador = await Colaborador.create(data)
  return NextResponse.json(colaborador, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'master') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  }
  const { id } = await req.json()
  await connectDB()
  await Colaborador.findByIdAndUpdate(id, { ativo: false })
  return NextResponse.json({ ok: true })
}
