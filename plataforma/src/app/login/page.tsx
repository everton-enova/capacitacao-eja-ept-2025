'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [cpf, setCpf] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function mascararCPF(v: string) {
    v = v.replace(/\D/g, '')
    if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3)
    if (v.length > 7) v = v.slice(0, 7) + '.' + v.slice(7)
    if (v.length > 11) v = v.slice(0, 11) + '-' + v.slice(11, 13)
    return v.slice(0, 14)
  }

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
      router.push('/inscricao')
    }
  }

  return (
    <main className="min-h-screen bg-[#e8e8e8] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/brasao_estado.png" alt="Estado da Bahia" width={64} height={64} className="mb-4" />
          <h1 className="text-sm font-normal text-gray-500 text-center">Capacitação para Equipe de Campo</h1>
          <h2 className="text-xl font-bold text-gray-900 text-center">SABE 2025</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wide mb-1">
              CPF
            </label>
            <input
              type="text"
              value={cpf}
              onChange={e => setCpf(mascararCPF(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              required
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600 font-medium">{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-lg py-3 font-semibold text-sm hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
