'use client'
import { useEffect, useState } from 'react'
import type { SessionUser } from '@/lib/auth'

interface Stats {
  totalInscricoes: number
  comHospedagem: number
  porFuncao: { _id: string; total: number }[]
  totalColaboradores: number
  colaboradoresAtivos: number
}

function Card({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-4xl font-bold text-gray-950">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard({ session }: { session: SessionUser }) {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/painel/stats').then(r => r.json()).then(setStats)
  }, [])

  const saudacao = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-950">{saudacao()}, {session.nome.split(' ')[0]}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {session.funcao}{session.nte ? ` · ${session.nte}` : ''}
        </p>
      </div>

      {!stats ? (
        <p className="text-sm text-gray-400">Carregando...</p>
      ) : (
        <div className="space-y-6">
          {/* Cards principais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card label="Inscrições" value={stats.totalInscricoes} />
            <Card label="Com hospedagem" value={stats.comHospedagem}
              sub={stats.totalInscricoes ? `${Math.round(stats.comHospedagem / stats.totalInscricoes * 100)}% do total` : undefined} />
            <Card label="Colaboradores" value={stats.totalColaboradores} />
            <Card label="Ativos" value={stats.colaboradoresAtivos}
              sub={stats.totalColaboradores ? `${Math.round(stats.colaboradoresAtivos / stats.totalColaboradores * 100)}% do total` : undefined} />
          </div>

          {/* Inscrições por função */}
          {stats.porFuncao.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Inscrições por função</p>
              <div className="space-y-3">
                {stats.porFuncao.map(f => {
                  const pct = stats.totalInscricoes ? Math.round(f.total / stats.totalInscricoes * 100) : 0
                  return (
                    <div key={f._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{f._id || 'Sem função'}</span>
                        <span className="text-sm font-semibold text-gray-950">{f.total}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {stats.totalInscricoes === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-400 text-sm">Nenhuma inscrição registrada ainda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
