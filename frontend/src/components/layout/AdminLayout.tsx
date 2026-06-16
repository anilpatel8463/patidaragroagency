import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCheck, BarChart3, Settings, 
  User, LogOut, Leaf, Menu, X, Bell, Search,
  ChevronLeft, ChevronRight, ExternalLink, ShoppingBag, 
  Package, FolderTree, Star, Tag, Mail
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, category: 'General' },
  { to: '/admin/customers', label: 'Users', icon: Users, category: 'CRM' },
  { to: '/admin/leads', label: 'Leads', icon: UserCheck, category: 'CRM' },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3, category: 'Analytics' },
  { to: '/admin/products', label: 'Products', icon: Package, category: 'Inventory' },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree, category: 'Inventory' },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, category: 'Sales' },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag, category: 'Sales' },
  { to: '/admin/reviews', label: 'Reviews', icon: Star, category: 'Engagement' },
  { to: '/admin/newsletters', label: 'Newsletters', icon: Mail, category: 'Engagement' },
  { to: '/admin/settings', label: 'Settings', icon: Settings, category: 'System' },
  { to: '/admin/profile', label: 'Profile', icon: User, category: 'System' },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const groupedNav = adminNav.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof adminNav>)

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'bg-agro-900 text-white transition-all duration-300 ease-in-out border-r border-agro-800 flex flex-col shrink-0',
        sidebarOpen ? 'w-64' : 'w-20',
        isMobile ? (mobileMenuOpen ? 'fixed inset-y-0 left-0 z-[70] translate-x-0 w-64' : 'fixed inset-y-0 left-0 z-[70] -translate-x-full') : 'relative z-[70] translate-x-0'
      )}>
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-agro-800 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
                <Leaf className="h-6 w-6 text-primary" />
             </div>
             {(sidebarOpen || (isMobile && mobileMenuOpen)) && (
                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                   <span className="font-bold text-lg tracking-tight">Patidar <span className="text-primary italic">Agro</span></span>
                   <span className="text-[10px] text-agro-400 font-medium uppercase tracking-widest -mt-1">Control Hub</span>
                </div>
             )}
          </div>
          {isMobile && (
            <button className="ml-auto" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Profile Mini */}
        <div className={cn("px-4 py-6 border-b border-agro-800/50", !sidebarOpen && !isMobile && "flex justify-center px-0")}>
            <div className={cn("flex items-center gap-3 transition-all", !sidebarOpen && !isMobile && "flex-col")}>
                <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white font-bold border border-white/10 shadow-lg shrink-0">
                        {user?.full_name?.charAt(0) || 'A'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-agro-900" title="Online" />
                </div>
                {(sidebarOpen || (isMobile && mobileMenuOpen)) && (
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate text-white">{user?.full_name || 'Admin User'}</span>
                        <span className="text-[11px] text-agro-400 font-medium tracking-tight">Super Administrator</span>
                    </div>
                )}
            </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          {Object.entries(groupedNav).map(([category, items]) => (
            <div key={category} className="space-y-1.5">
              {(sidebarOpen || (isMobile && mobileMenuOpen)) && (
                <h3 className="text-[10px] font-bold text-agro-500 uppercase tracking-[0.2em] px-3 mb-2">{category}</h3>
              )}
              {items.map((item) => {
                const Icon = item.icon
                const active = location.pathname === item.to || (item.to !== '/admin' && location.pathname.startsWith(item.to))
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      active 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'text-agro-300 hover:bg-agro-800 hover:text-white'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-110', active ? 'text-white' : 'text-agro-400 group-hover:text-primary')} />
                    {(sidebarOpen || (isMobile && mobileMenuOpen)) && <span className="truncate">{item.label}</span>}
                    {!sidebarOpen && !isMobile && active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-agro-800 bg-agro-950/30">
          <button 
            onClick={logout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all",
              (!sidebarOpen && !isMobile) && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {(sidebarOpen || (isMobile && mobileMenuOpen)) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button 
                className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-gray-500"
                onClick={isMobile ? () => setMobileMenuOpen(true) : toggleSidebar}
            >
              {isMobile ? <Menu className="h-5 w-5" /> : (sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />)}
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 font-medium">
                <span className="hover:text-primary transition-colors cursor-pointer">Console</span>
                <span className="text-gray-300 italic">/</span>
                <span className="text-gray-900 font-bold tracking-tight">
                    {adminNav.find((n) => n.to === location.pathname)?.label || 'Dashboard'}
                </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden lg:flex relative mr-4 w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Quick search..." 
                    className="pl-9 h-10 bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20"
                />
             </div>
             
             <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white" />
             </button>
             
             <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block" />
             
             <button 
                onClick={() => navigate('/')}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-all"
             >
                <ExternalLink className="h-4 w-4" /> Live Site
             </button>
          </div>
        </header>

        {/* Content Region */}
        <main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar bg-[#F8FAFC]">
           {/* Dynamic Background Element */}
           <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none -z-10 opacity-50" />
           
           <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Outlet />
           </div>
        </main>
      </div>
    </div>
  )
}
