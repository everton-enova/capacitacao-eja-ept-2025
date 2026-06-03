import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Colaborador } from '@/models/Colaborador'
import { getSession } from '@/lib/auth'

async function checkMaster() {
  const session = await getSession()
  return session?.role === 'master' ? session : null
}

export async function GET() {
  if (!await checkMaster()) return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  await connectDB()
  const lista = await Colaborador.find().sort({ nome: 1 }).lean()
  return NextResponse.json(lista)
}

export async function POST(req: NextRequest) {
  if (!await checkMaster()) return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  const data = await req.json()
  await connectDB()
  const colaborador = await Colaborador.create(data)
  return NextResponse.json(colaborador, { status: 201 })
}

// Ativar ou desativar
export async function PATCH(req: NextRequest) {
  if (!await checkMaster()) return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  const { id, ativo } = await req.json()
  await connectDB()
  await Colaborador.findByIdAndUpdate(id, { ativo })
  return NextResponse.json({ ok: true })
}

// Excluir permanentemente
export async function DELETE(req: NextRequest) {
  if (!await checkMaster()) return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  const { id } = await req.json()
  await connectDB()
  await Colaborador.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
