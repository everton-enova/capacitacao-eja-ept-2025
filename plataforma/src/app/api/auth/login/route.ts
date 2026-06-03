import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Colaborador } from '@/models/Colaborador'
import { createSession, roleFromFuncao } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { cpf } = await req.json()

  if (!cpf) {
    return NextResponse.json({ error: 'CPF obrigatório.' }, { status: 400 })
  }

  await connectDB()

  const cpfLimpo = cpf.replace(/\D/g, '')
  const colaborador = await Colaborador.findOne({
    cpf: { $in: [cpf, cpfLimpo] },
    ativo: true,
  })

  if (!colaborador) {
    return NextResponse.json({ error: 'CPF não autorizado ou acesso inativo.' }, { status: 401 })
  }

  await createSession({
    cpf: colaborador.cpf,
    nome: colaborador.nome,
    funcao: colaborador.funcao,
    nte: colaborador.nte ?? '',
    role: roleFromFuncao(colaborador.funcao),
  })

  return NextResponse.json({ ok: true, role: roleFromFuncao(colaborador.funcao) })
}
