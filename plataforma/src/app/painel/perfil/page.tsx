import { getSession } from '@/lib/auth'
import PerfilClient from './PerfilClient'

export const dynamic = 'force-dynamic'

export default async function PerfilPage() {
  const session = await getSession()
  if (!session) return null
  return <PerfilClient session={session} />
}
