import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import FormularioClient from './FormularioClient'

export default async function FormularioPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return <FormularioClient session={session} />
}
