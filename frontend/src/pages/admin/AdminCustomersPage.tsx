import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Search, Mail, MapPin, Phone, User as UserIcon, MoreHorizontal } from 'lucide-react'
import type { User } from '@/types'

export function AdminCustomersPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page],
    queryFn: () => adminApi.customers.list(page).then((r) => r.data.data),
  })

  if (isLoading) return <Spinner className="py-20" />

  const filteredCustomers = data?.items.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Directory</h2>
          <p className="text-muted-foreground">Detailed overview of all registered customers and their activity.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers by name or email..." 
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 border-b text-gray-900 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4 hidden md:table-cell">Contact Info</th>
                  <th className="p-4 hidden lg:table-cell">Location</th>
                  <th className="p-4">Joined On</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredCustomers.map((customer: User) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                          {customer.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{customer.full_name}</p>
                          <p className="text-xs text-muted-foreground">ID: {customer.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-gray-600">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-gray-600">{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{[customer.city, customer.state].filter(Boolean).join(', ') || 'Remote'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-600">{formatDate(customer.created_at)}</p>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCustomers.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <UserIcon className="mx-auto h-12 w-12 text-muted-foreground/20" />
              <p className="text-muted-foreground font-medium italic">No customers found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {data && data.pages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground tabular-nums">
            Showing page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{data.pages}</span>
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
