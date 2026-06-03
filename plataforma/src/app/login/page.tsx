'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

function mascararCPF(v: string) {
  v = v.replace(/\D/g, '')
  if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3)
  if (v.length > 7) v = v.slice(0, 7) + '.' + v.slice(7)
  if (v.length > 11) v = v.slice(0, 11) + '-' + v.slice(11, 13)
  return v.slice(0, 14)
}

export default function LoginPage() {
  const [cpf, setCpf] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setErro(data.error ?? 'Erro ao validar CPF.')
      return
    }

    if (data.role === 'master' || data.role === 'subcoordenador') {
      router.push('/painel/inscricoes')
    } else {
      router.push('/painel/inscricoes')
    }
  }

  return (
    <main className="min-h-screen flex">
      {/* Painel esquerdo — fixo */}
      <div
        className="hidden lg:flex fixed top-0 left-0 h-screen w-80 xl:w-96 flex-col justify-between p-10 z-10"
        style={{ backgroundImage: "url('/background.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(28,28,28,0.92)' }} />

        <div className="relative z-10 text-white">
          <Image src="/brasao_estado.png" alt="Estado da Bahia" width={140} height={140} className="mb-8" />
          <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-3">
            Capacitação para<br />Equipe de Campo
          </p>
          <h1 className="text-3xl font-bold leading-snug">
            Avaliação<br />de Entrada<br />EJA e EPT
          </h1>
        </div>

        <div className="relative z-10 text-white space-y-6">
          <div className="border-t border-white/15 pt-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Data</p>
            <p className="text-sm font-light text-white/90">04 de Julho de 2026</p>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed">
            Acesse o painel com o CPF<br />
            cadastrado no formulário<br />
            de inscrição.
          </p>
        </div>
      </div>

      {/* Painel direito */}
      <div className="lg:ml-80 xl:ml-96 flex-1 min-h-screen bg-[#e8e8e8] flex items-center justify-center px-4">
        {/* Header mobile */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
          <Image src="/brasao_estado.png" alt="Estado da Bahia" width={32} height={32} />
          <div>
            <p className="text-xs text-gray-500">SABE 2025 — EJA e EPT</p>
            <p className="text-sm font-semibold text-gray-900">Acesso ao Painel</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-8 mt-16 lg:mt-0">
          <h2 className="text-xl font-bold text-gray-950 mb-1">Acesso ao painel</h2>
          <p className="text-sm text-gray-500 mb-6">Digite seu CPF para entrar.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-950 uppercase tracking-wide mb-1">
                CPF
              </label>
              <input
                type="text"
                value={cpf}
                onChange={e => setCpf(mascararCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                required
                autoFocus
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-950 focus:outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {erro && <p className="text-sm text-red-600 font-medium">{erro}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white rounded-lg py-3 font-semibold text-sm hover:bg-gray-700 transition disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
