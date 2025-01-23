import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card px-4 py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-center">
            <UserNav />
          </div>
          <MainNav />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Search />
          </div>
        </div>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}