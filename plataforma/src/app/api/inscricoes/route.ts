import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Inscricao } from '@/models/Inscricao'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  await connectDB()

  const filtro = session.role === 'territorial' ? { nte: session.nte } : {}
  const inscricoes = await Inscricao.find(filtro).sort({ createdAt: -1 }).lean()
  return NextResponse.json(inscricoes)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role === 'territorial') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  }
  const { id } = await req.json()
  await connectDB()
  await Inscricao.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
