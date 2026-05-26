import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function DocenteLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <Navbar />
      <main className="ml-[260px] pt-16">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
