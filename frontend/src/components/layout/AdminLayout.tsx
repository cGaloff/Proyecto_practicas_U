import { Outlet } from 'react-router-dom'
import { AdminNavbar } from './AdminNavbar'
import { AdminSidebar } from './AdminSidebar'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1" style={{ paddingTop: '56px' }}>
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8" style={{ marginLeft: '224px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
