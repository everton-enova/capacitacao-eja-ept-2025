'use client'
import { useEffect, useState } from 'react'
import type { SessionUser } from '@/lib/auth'

const inputCls = 'w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-950 focus:outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed'
const labelCls = 'block text-xs font-semibold text-gray-950 uppercase tracking-wide mb-1'
const sectionCls = 'text-xs font-bold tracking-widest text-gray-950 uppercase pb-2 border-b-2 border-gray-200 mb-4'

function maskTel(v: string) {
  v = v.replace(/\D/g, '')
  if (v.length > 0) v = '(' + v
  if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3)
  if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10, 15)
  return v.slice(0, 15)
}

interface Props { session: SessionUser }

export default function PerfilClient({ session }: Props) {
  const [form, setForm] = useState({
    nome: '', contato: '', email: '',
    banco: '', agencia: '', conta: '', tipoConta: '',
  })
  const [original, setOriginal] = useState(form)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState<{ texto: string; tipo: 'ok' | 'erro' } | null>(null)
  const [semInscricao, setSemInscricao] = useState(false)

  useEffect(() => {
    fetch('/api/perfil')
      .then(r => r.json())
      .then(data => {
        const insc = data.inscricao
        const col = data.colaborador
        if (!insc) { setSemInscricao(true); setLoading(false); return }
        const vals = {
          nome: col?.nome ?? '',
          contato: insc.contato ?? '',
          email: insc.email ?? '',
          banco: insc.banco ?? '',
          agencia: insc.agencia ?? '',
          conta: insc.conta ?? '',
          tipoConta: insc.tipoConta ?? '',
        }
        setForm(vals)
        setOriginal(vals)
        setLoading(false)
      })
  }, [])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setMsg(null)
  }

  const alterado = JSON.stringify(form) !== JSON.stringify(original)

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true); setMsg(null)
    const res = await fetch('/api/perfil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSalvando(false)
    if (res.ok) {
      setOriginal(form)
      setMsg({ texto: 'Dados atualizados com sucesso!', tipo: 'ok' })
    } else {
      setMsg({ texto: 'Erro ao salvar. Tente novamente.', tipo: 'erro' })
    }
  }

  if (loading) return <div className="p-6 text-sm text-gray-400">Carregando...</div>

  if (semInscricao) return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-950 mb-1">Meu Perfil</h1>
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-800">
        Você ainda não preencheu o formulário de inscrição. Acesse{' '}
        <a href="/formulario-capacitacao" className="font-semibold underline">formulário de capacitação</a>{' '}
        para cadastrar seus dados.
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Edite seus dados pessoais e bancários</p>
      </div>

      <form onSubmit={handleSalvar} className="space-y-6">
        {/* Dados fixos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className={sectionCls}>Identificação</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>CPF</label>
              <input value={session.cpf} disabled className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Função</label>
              <input value={session.funcao} disabled className={inputCls} />
            </div>
            {session.nte && (
              <div className="col-span-2">
                <label className={labelCls}>NTE</label>
                <input value={session.nte} disabled className={inputCls} />
              </div>
            )}
          </div>
        </div>

        {/* Dados pessoais editáveis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <p className={sectionCls}>Dados Pessoais</p>
          <div>
            <label className={labelCls}>Nome completo *</label>
            <input value={form.nome} onChange={e => set('nome', e.target.value)} required className={inputCls} placeholder="Seu nome completo" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Contato (com DDD)</label>
              <input value={form.contato} onChange={e => set('contato', maskTel(e.target.value))} maxLength={15} className={inputCls} placeholder="(00) 00000-0000" />
            </div>
            <div>
              <label className={labelCls}>E-mail</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="seu@email.com" />
            </div>
          </div>
        </div>

        {/* Dados bancários */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <p className={sectionCls}>Dados Bancários</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Banco</label>
              <input value={form.banco} onChange={e => set('banco', e.target.value)} className={inputCls} placeholder="Ex: Banco do Brasil" />
              <p className="text-xs text-gray-400 mt-1">Nome completo com dígito.</p>
            </div>
            <div>
              <label className={labelCls}>Tipo de conta</label>
              <select value={form.tipoConta} onChange={e => set('tipoConta', e.target.value)} className={inputCls}>
                <option value="">Selecione</option>
                <option value="Corrente">Conta Corrente</option>
                <option value="Poupança">Conta Poupança</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Agência</label>
              <input value={form.agencia} onChange={e => set('agencia', e.target.value)} className={inputCls} placeholder="0000-0" />
              <p className="text-xs text-gray-400 mt-1">Informe com o dígito verificador.</p>
            </div>
            <div>
              <label className={labelCls}>Conta</label>
              <input value={form.conta} onChange={e => set('conta', e.target.value)} className={inputCls} placeholder="00000-0" />
              <p className="text-xs text-gray-400 mt-1">Informe com o dígito verificador.</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Chave PIX:</span> {session.cpf}
            </p>
          </div>
        </div>

        {msg && (
          <p className={`text-sm font-medium ${msg.tipo === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
            {msg.texto}
          </p>
        )}

        <button type="submit" disabled={salvando || !alterado}
          className="w-full bg-gray-900 text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 transition disabled:opacity-40">
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  )
}
