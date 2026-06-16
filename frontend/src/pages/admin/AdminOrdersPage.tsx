import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice, formatDate, formatStatus, cn } from '@/lib/utils'
import { Search, Filter, Truck, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react'
import type { Order } from '@/types'

const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

export function AdminOrdersPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: () => adminApi.orders.list(1, statusFilter || undefined).then((r) => r.data.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.orders.updateStatus(id, status),
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
       // Optional: Add toast notification
    },
  })

  const filteredOrders = data?.items.filter(o => 
    o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) return <Spinner className="py-20" />

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">Monitor sales, update shipping status, and manage active orders.</p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-white">
                {data?.total || 0} Total Orders
            </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by order # or customer..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{formatStatus(s)}</option>)}
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> More Filters
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Order Information</th>
                  <th className="text-left p-4 font-semibold text-gray-900 hidden md:table-cell">Date</th>
                  <th className="text-right p-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-900 hidden sm:table-cell">Payment</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                  <th className="text-right p-4 font-semibold text-gray-900">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                            <ShoppingBag className="h-5 w-5" />
                         </div>
                         <div className="cursor-pointer group/link" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                            <p className="font-bold text-gray-900 group-hover/link:text-primary transition-colors">{order.order_number}</p>
                            <p className="text-xs text-muted-foreground">{order.user?.full_name || 'Guest Customer'}</p>
                         </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="p-4 text-right">
                        <p className="font-bold text-gray-900">{formatPrice(order.total_amount)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{order.items.length} items</p>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className={cn("h-3.5 w-3.5", order.payment_status === 'paid' ? "text-emerald-500" : "text-amber-500")} />
                          <span className={cn("text-xs font-medium uppercase", order.payment_status === 'paid' ? "text-emerald-600" : "text-amber-600")}>
                              {order.payment_status}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">{order.payment_method || 'Online'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={cn("border-none shadow-none text-[10px] uppercase h-6 px-2 font-bold", getStatusColor(order.order_status))}>
                        {formatStatus(order.order_status)}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                            value={order.order_status}
                            onChange={(e) => updateMutation.mutate({ id: order.id, status: e.target.value })}
                            className="w-32 h-8 text-[11px] bg-gray-50 border-gray-200"
                        >
                            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{formatStatus(s)}</option>)}
                        </Select>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="py-20 text-center space-y-3">
               <div className="flex justify-center"><Truck className="h-12 w-12 text-muted-foreground/20" /></div>
               <p className="text-muted-foreground italic font-medium">No matching orders found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
