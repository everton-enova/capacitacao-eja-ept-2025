import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Inscricao } from '@/models/Inscricao'

export async function POST(req: NextRequest) {

  const data = await req.json()

  await connectDB()

  const existe = await Inscricao.findOne({ cpf: data.cpf })
  if (existe) {
    return NextResponse.json({ error: 'Este CPF já possui inscrição.' }, { status: 409 })
  }

  await Inscricao.create(data)

  // Sincroniza com Google Sheets via Apps Script existente
  try {
    await fetch(process.env.APPS_SCRIPT_URL!, {
      method: 'POST',
      body: JSON.stringify({ action: 'inscrever', ...data }),
    })
  } catch {
    // falha no Sheets não bloqueia o salvamento no MongoDB
  }

  return NextResponse.json({ ok: true })
}
