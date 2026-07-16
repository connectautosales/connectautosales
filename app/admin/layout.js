export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { headers } from 'next/headers'
import AdminSidebar from './AdminSidebar'
import styles from './layout.module.css'

export const metadata = { title: 'Admin — Connect Auto Sales' }

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login')

  const showSidebar = session && !isLoginPage

  return (
    <div className={styles.adminRoot}>
      {showSidebar && <AdminSidebar />}
      <main className={`${styles.adminMain} ${!showSidebar ? styles.fullWidth : ''}`}>
        {children}
      </main>
    </div>
  )
}
