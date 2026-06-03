'use client'
import { useEffect, useState } from 'react'
import type { Role } from '@/lib/auth'

interface Inscricao {
  _id: string
  nome: string
  cpf: string
  funcao: string
  nte: string
  municipio: string
  hospedagem: string
  tipoDeslocamento: string
  createdAt: string
}

export default function TabelaInscricoes({ role, nte }: { role: Role; nte: string }) {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  async function carregar() {
    const res = await fetch('/api/inscricoes')
    const data = await res.json()
    setInscricoes(data)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  const filtradas = inscricoes.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase()) ||
    i.cpf.includes(busca) ||
    i.municipio?.toLowerCase().includes(busca.toLowerCase())
  )

  async function excluir(id: string, nome: string) {
    if (!confirm(`Excluir a inscrição de "${nome}"? Esta ação não pode ser desfeita.`)) return
    await fetch('/api/inscricoes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    carregar()
  }

  async function exportarCSV() {
    const res = await fetch('/api/inscricoes')
    const data: Inscricao[] = await res.json()
    const cols = ['Nome', 'CPF', 'Função', 'NTE', 'Município', 'Hospedagem', 'Tipo Deslocamento', 'Data']
    const rows = data.map(i => [
      i.nome, i.cpf, i.funcao, i.nte, i.municipio,
      i.hospedagem, i.tipoDeslocamento,
      new Date(i.createdAt).toLocaleDateString('pt-BR')
    ])
    const csv = [cols, ...rows].map(r => r.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'inscricoes.csv'; a.click()
  }

  const podeExcluir = role === 'master' || role === 'subcoordenador'

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou município..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-600"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{filtradas.length} inscrição(ões)</span>
          {podeExcluir && (
            <button onClick={exportarCSV} className="bg-white border border-gray-300 text-gray-700 text-xs px-3 py-2 rounded-lg hover:bg-gray-50 transition">
              Exportar CSV
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : filtradas.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma inscrição encontrada.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Nome', 'CPF', 'Função', 'NTE', 'Município', 'Hospedagem', 'Deslocamento', 'Data', ...(podeExcluir ? [''] : [])].map((h, i) => (
                  <th key={i} className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((i, idx) => (
                <tr key={i._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 font-medium text-gray-900">{i.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{i.cpf}</td>
                  <td className="px-4 py-3 text-gray-600">{i.funcao}</td>
                  <td className="px-4 py-3 text-gray-600">{i.nte || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{i.municipio || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${i.hospedagem === 'Sim' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                      {i.hospedagem || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{i.tipoDeslocamento || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(i.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  {podeExcluir && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => excluir(i._id, i.nome)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium whitespace-nowrap"
                      >
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
