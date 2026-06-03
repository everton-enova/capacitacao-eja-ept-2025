'use client'
import { useEffect, useState } from 'react'

const FUNCOES = ['Coordenador Estadual', 'Subcoordenador Estadual', 'Coordenador Territorial']
const NTE_LIST = ["NTE 01 - Irecê","NTE 02 - Velho Chico","NTE 03 - Chapada Diamantina","NTE 04 - Sisal","NTE 05 - Litoral Sul","NTE 06 - Baixo Sul","NTE 07 - Extremo Sul","NTE 08 - Médio Sudoeste da Bahia","NTE 09 - Vale do Jiquiriçá","NTE 10 - Sertão do São Francisco","NTE 11 - Bacia do Rio Grande","NTE 12 - Bacia do Paramirim","NTE 13 - Sertão Produtivo","NTE 14 - Piemonte do Paraguaçu","NTE 15 - Bacia do Jacuípe","NTE 16 - Piemonte da Diamantina","NTE 17 - Semiárido Nordeste II","NTE 18 - Litoral Norte e Agreste","NTE 19 - Portal do Sertão","NTE 20 - Sudoeste Baiano","NTE 21 - Recôncavo","NTE 22 - Médio Rio de Contas","NTE 23 - Bacia do Rio Corrente","NTE 24 - Itaparica","NTE 25 - Piemonte Norte do Itapicuru","NTE 26 - Metropolitano de Salvador","NTE 27 - Costa do Descobrimento"]

interface Colaborador {
  _id: string; cpf: string; nome: string; funcao: string; nte: string; ativo: boolean
}

const empty = { cpf: '', nome: '', funcao: '', nte: '' }

export default function GerenciarColaboradores() {
  const [lista, setLista] = useState<Colaborador[]>([])
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')

  function mascararCPF(v: string) {
    v = v.replace(/\D/g, '')
    if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3)
    if (v.length > 7) v = v.slice(0, 7) + '.' + v.slice(7)
    if (v.length > 11) v = v.slice(0, 11) + '-' + v.slice(11, 13)
    return v.slice(0, 14)
  }

  async function carregar() {
    setLoading(true)
    const res = await fetch('/api/colaboradores')
    setLista(await res.json())
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  async function adicionar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true); setMsg('')
    const res = await fetch('/api/colaboradores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSalvando(false)
    if (res.ok) { setForm(empty); setMsg('Colaborador adicionado!'); carregar() }
    else { const d = await res.json(); setMsg(d.error ?? 'Erro ao adicionar.') }
  }

  async function desativar(id: string) {
    await fetch('/api/colaboradores', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    carregar()
  }

  return (
    <div className="space-y-6">
      {/* Formulário de adição */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Adicionar colaborador</h2>
        <form onSubmit={adicionar} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">CPF *</label>
            <input value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: mascararCPF(e.target.value) }))}
              placeholder="000.000.000-00" maxLength={14} required
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nome *</label>
            <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              placeholder="Nome completo" required
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Função *</label>
            <select value={form.funcao} onChange={e => setForm(f => ({ ...f, funcao: e.target.value, nte: '' }))} required
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-600">
              <option value="">Selecione</option>
              {FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          {form.funcao === 'Coordenador Territorial' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">NTE *</label>
              <select value={form.nte} onChange={e => setForm(f => ({ ...f, nte: e.target.value }))} required
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-600">
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

      {/* Lista */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Carregando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Nome', 'CPF', 'Função', 'NTE', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lista.map((c, idx) => (
                <tr key={c._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{c.cpf}</td>
                  <td className="px-4 py-3 text-gray-600">{c.funcao}</td>
                  <td className="px-4 py-3 text-gray-600">{c.nte || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                      {c.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.ativo && (
                      <button onClick={() => desativar(c._id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium">
                        Desativar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
