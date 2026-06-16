import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Mail, Calendar } from 'lucide-react'
import { adminApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function AdminNewslettersPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-newsletters'],
    queryFn: () => adminApi.newsletters.list().then((r) => r.data.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.newsletters.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-newsletters'] }),
  })

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Newsletter Subscribers</h2>
          <p className="text-muted-foreground">Manage your mailing list and active subscriptions.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
          <Mail className="h-5 w-5" />
          <span className="font-bold">{data?.total || 0} Total Subscribers</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900">Email Address</th>
              <th className="text-left p-4 font-semibold text-gray-900">Status</th>
              <th className="text-left p-4 font-semibold text-gray-900">Subscribed Date</th>
              <th className="text-right p-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.items.map((s: any) => (
              <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{s.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={s.is_active ? 'success' : 'secondary'}>
                    {s.is_active ? 'Active' : 'Unsubscribed'}
                  </Badge>
                </td>
                <td className="p-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(s.subscribed_at)}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      if (confirm('Are you sure you want to remove this subscriber?')) {
                        deleteMutation.mutate(s.id)
                      }
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {(!data?.items || data.items.length === 0) && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-muted-foreground italic">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
