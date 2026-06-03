import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Inscricao } from '@/models/Inscricao'
import { Colaborador } from '@/models/Colaborador'

export async function POST(req: NextRequest) {
  const data = await req.json()

  if (!data.cpf || !data.nome || !data.funcao) {
    return NextResponse.json({ error: 'Dados obrigatórios ausentes.' }, { status: 400 })
  }

  await connectDB()

  // Verifica CPF duplicado na inscrição
  const inscricaoExiste = await Inscricao.findOne({ cpf: data.cpf })
  if (inscricaoExiste) {
    return NextResponse.json({ error: 'Este CPF já possui inscrição cadastrada.' }, { status: 409 })
  }

  // Salva a inscrição completa
  await Inscricao.create(data)

  // Cria ou atualiza o colaborador para liberar o acesso ao painel
  await Colaborador.findOneAndUpdate(
    { cpf: data.cpf },
    { cpf: data.cpf, nome: data.nome, funcao: data.funcao, nte: data.nte ?? '', ativo: true },
    { upsert: true, new: true }
  )

  // Sincroniza com Google Sheets
  try {
    await fetch(process.env.APPS_SCRIPT_URL!, {
      method: 'POST',
      body: JSON.stringify({ action: 'inscrever', ...data }),
    })
  } catch {
    // falha no Sheets não bloqueia o cadastro
  }

  return NextResponse.json({ ok: true })
}
