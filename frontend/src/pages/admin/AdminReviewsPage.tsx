import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, Check } from 'lucide-react'
import { adminApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { formatDate } from '@/lib/utils'

export function AdminReviewsPage() {
  const queryClient = useQueryClient()
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => adminApi.reviews.list().then((r) => r.data.data),
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.reviews.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }),
  })

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Reviews</h2>
      <div className="space-y-4">
        {reviews?.map((r) => (
          <div key={r.id} className="bg-white border rounded-lg p-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">{[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}</div>
                <span className="font-medium text-sm">{r.user_name}</span>
                {r.is_approved ? <Badge variant="success">Approved</Badge> : <Badge variant="warning">Pending</Badge>}
              </div>
              {r.title && <p className="font-medium text-sm">{r.title}</p>}
              <p className="text-sm text-muted-foreground">{r.comment}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(r.created_at)}</p>
            </div>
            {!r.is_approved && (
              <Button size="sm" variant="outline" onClick={() => approveMutation.mutate(r.id)}>
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
            )}
          </div>
        ))}
        {(!reviews || reviews.length === 0) && <p className="text-muted-foreground text-center py-8">No reviews yet</p>}
      </div>
    </div>
  )
}
