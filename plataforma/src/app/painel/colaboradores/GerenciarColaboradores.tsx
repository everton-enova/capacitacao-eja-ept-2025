'use client'
import { useEffect, useState } from 'react'
import type { Role } from '@/lib/auth'

const FUNCOES = ['Coordenador Estadual', 'Subcoordenador Estadual', 'Coordenador Territorial']
const NTE_LIST = ["NTE 01 - Irecê","NTE 02 - Velho Chico","NTE 03 - Chapada Diamantina","NTE 04 - Sisal","NTE 05 - Litoral Sul","NTE 06 - Baixo Sul","NTE 07 - Extremo Sul","NTE 08 - Médio Sudoeste da Bahia","NTE 09 - Vale do Jiquiriçá","NTE 10 - Sertão do São Francisco","NTE 11 - Bacia do Rio Grande","NTE 12 - Bacia do Paramirim","NTE 13 - Sertão Produtivo","NTE 14 - Piemonte do Paraguaçu","NTE 15 - Bacia do Jacuípe","NTE 16 - Piemonte da Diamantina","NTE 17 - Semiárido Nordeste II","NTE 18 - Litoral Norte e Agreste","NTE 19 - Portal do Sertão","NTE 20 - Sudoeste Baiano","NTE 21 - Recôncavo","NTE 22 - Médio Rio de Contas","NTE 23 - Bacia do Rio Corrente","NTE 24 - Itaparica","NTE 25 - Piemonte Norte do Itapicuru","NTE 26 - Metropolitano de Salvador","NTE 27 - Costa do Descobrimento"]

interface Inscricao { banco?: string; agencia?: string; conta?: string; tipoConta?: string; email?: string; contato?: string }
interface Colaborador {
  _id: string; cpf: string; nome: string; funcao: string; nte: string
  ativo: boolean; subcoordenadorCpf?: string; inscricao?: Inscricao
}

const empty = { cpf: '', nome: '', funcao: '', nte: '' }
const inputCls = 'w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-950 focus:outline-none focus:border-gray-600'
const labelCls = 'block text-xs font-semibold text-gray-950 uppercase tracking-wide mb-1'

interface Props { role: Role; sessionCpf: string }

export default function GerenciarColaboradores({ role, sessionCpf }: Props) {
  const [lista, setLista] = useState<Colaborador[]>([])
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')
  const [busca, setBusca] = useState('')

  function maskCPF(v: string) {
    v = v.replace(/\D/g, '')
    if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3)
    if (v.length > 7) v = v.slice(0, 7) + '.' + v.slice(7)
    if (v.length > 11) v = v.slice(0, 11) + '-' + v.slice(11, 13)
    return v.slice(0, 14)
  }

  async function carregar() {
    setLoading(true)
    const res = await fetch('/api/colaboradores')
    const data = await res.json()
    setLista(data.lista ?? [])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  async function adicionar(e: React.FormEvent) {
    e.preventDefault(); setSalvando(true); setMsg('')
    const res = await fetch('/api/colaboradores', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setSalvando(false)
    if (res.ok) { setForm(empty); setMsg('Colaborador adicionado!'); carregar() }
    else { const d = await res.json(); setMsg(d.error ?? 'Erro ao adicionar.') }
  }

  async function toggleAtivo(id: string, ativo: boolean) {
    await fetch('/api/colaboradores', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ativo }) })
    carregar()
  }

  async function excluir(id: string, nome: string) {
    if (!confirm(`Excluir permanentemente "${nome}"?`)) return
    await fetch('/api/colaboradores', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    carregar()
  }

  async function vincular(id: string) {
    await fetch('/api/colaboradores', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'vincular' }) })
    carregar()
  }

  async function desvincular(id: string) {
    await fetch('/api/colaboradores', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'desvincular' }) })
    carregar()
  }

  const filtrados = lista.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpf.includes(busca) ||
    c.nte?.toLowerCase().includes(busca.toLowerCase())
  )

  const meus = filtrados.filter(c => c.subcoordenadorCpf === sessionCpf)
  const disponiveis = filtrados.filter(c => !c.subcoordenadorCpf)
  const vinculadosOutros = filtrados.filter(c => c.subcoordenadorCpf && c.subcoordenadorCpf !== sessionCpf)

  const thCls = 'text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3'
  const tdCls = 'px-4 py-3 text-sm text-gray-700'

  function Linha({ c }: { c: Colaborador }) {
    return (
      <tr className="border-b border-gray-100 hover:bg-gray-50/50">
        <td className="px-4 py-3">
          <p className="text-sm font-medium text-gray-950">{c.nome}</p>
          <p className="text-xs text-gray-400">{c.cpf}</p>
        </td>
        <td className={tdCls}>{c.funcao}</td>
        <td className={tdCls}>{c.nte || '—'}</td>
        <td className={tdCls}>{c.inscricao?.contato || '—'}</td>
        <td className={tdCls}>{c.inscricao?.email || '—'}</td>
        <td className={tdCls}>
          {c.inscricao?.banco ? (
            <div>
              <p className="text-xs font-medium">{c.inscricao.banco}</p>
              <p className="text-xs text-gray-400">Ag: {c.inscricao.agencia} · Cc: {c.inscricao.conta}</p>
              <p className="text-xs text-gray-400">{c.inscricao.tipoConta} · PIX: {c.cpf}</p>
            </div>
          ) : <span className="text-gray-300 text-xs">Sem inscrição</span>}
        </td>
        {role === 'master' && (
          <td className="px-4 py-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
              {c.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </td>
        )}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {role === 'subcoordenador' && (
              c.subcoordenadorCpf === sessionCpf
                ? <button onClick={() => desvincular(c._id)} className="text-xs text-amber-600 hover:text-amber-800 font-medium">Desvincular</button>
                : !c.subcoordenadorCpf
                ? <button onClick={() => vincular(c._id)} className="text-xs text-green-600 hover:text-green-800 font-medium">Vincular</button>
                : null
            )}
            {role === 'master' && (<>
              {c.ativo
                ? <button onClick={() => toggleAtivo(c._id, false)} className="text-xs text-amber-600 hover:text-amber-800 font-medium">Desativar</button>
                : <button onClick={() => toggleAtivo(c._id, true)} className="text-xs text-green-600 hover:text-green-800 font-medium">Ativar</button>}
              <button onClick={() => excluir(c._id, c.nome)} className="text-xs text-red-600 hover:text-red-800 font-medium">Excluir</button>
            </>)}
          </div>
        </td>
      </tr>
    )
  }

  function Tabela({ items, titulo }: { items: Colaborador[]; titulo?: string }) {
    if (items.length === 0) return null
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto mb-4">
        {titulo && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 pt-4 pb-2">{titulo}</p>}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className={thCls}>Nome / CPF</th>
              <th className={thCls}>Função</th>
              <th className={thCls}>NTE</th>
              <th className={thCls}>Contato</th>
              <th className={thCls}>E-mail</th>
              <th className={thCls}>Dados Bancários</th>
              {role === 'master' && <th className={thCls}>Status</th>}
              <th className={thCls}></th>
            </tr>
          </thead>
          <tbody>{items.map(c => <Linha key={c._id} c={c} />)}</tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Formulário de adição — só master */}
      {role === 'master' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-950 mb-4">Adicionar colaborador</h2>
          <form onSubmit={adicionar} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>CPF *</label>
              <input value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: maskCPF(e.target.value) }))}
                placeholder="000.000.000-00" maxLength={14} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Nome *</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                placeholder="Nome completo" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Função *</label>
              <select value={form.funcao} onChange={e => setForm(f => ({ ...f, funcao: e.target.value, nte: '' }))} required className={inputCls}>
                <option value="">Selecione</option>
                {FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            {form.funcao === 'Coordenador Territorial' && (
              <div>
                <label className={labelCls}>NTE *</label>
                <select value={form.nte} onChange={e => setForm(f => ({ ...f, nte: e.target.value }))} required className={inputCls}>
                  <option value="">Selecione</option>
                  {NTE_LIST.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            <div className="sm:col-span-2 flex items-center gap-3">
              <button type="submit" disabled={salvando}
                className="bg-gray-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50">
                {salvando ? 'Salvando...' : 'Adicionar'}
              </button>
              {msg && <span className="text-sm text-gray-600">{msg}</span>}
            </div>
          </form>
        </div>
      )}

      {/* Busca */}
      <input type="text" placeholder="Buscar por nome, CPF ou NTE..."
        value={busca} onChange={e => setBusca(e.target.value)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-600" />

      {loading ? <p className="text-sm text-gray-400">Carregando...</p> : (
        role === 'subcoordenador' ? (
          <>
            <Tabela items={meus} titulo={`Meus Coordenadores Territoriais (${meus.length})`} />
            <Tabela items={disponiveis} titulo={`Disponíveis para vincular (${disponiveis.length})`} />
            {vinculadosOutros.length > 0 && <Tabela items={vinculadosOutros} titulo={`Vinculados a outros Subcoordenadores (${vinculadosOutros.length})`} />}
            {filtrados.length === 0 && <p className="text-sm text-gray-400">Nenhum Coordenador Territorial encontrado.</p>}
          </>
        ) : (
          <Tabela items={filtrados} />
        )
      )}
    </div>
  )
}
