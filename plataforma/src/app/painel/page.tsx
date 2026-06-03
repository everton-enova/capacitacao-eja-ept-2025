import { getSession } from '@/lib/auth'
import Dashboard from './Dashboard'

export default async function PainelPage() {
  const session = await getSession()
  return <Dashboard session={session!} />
}
