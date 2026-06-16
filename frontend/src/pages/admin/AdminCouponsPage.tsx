import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { adminApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

export function AdminCouponsPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '0' })
  const queryClient = useQueryClient()

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminApi.coupons.list().then((r) => r.data.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => adminApi.coupons.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }); setShowForm(false) },
  })

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Coupons</h2>
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-1" /> Add Coupon</Button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ ...form, discount_value: Number(form.discount_value), min_order_amount: Number(form.min_order_amount) }) }}
          className="border rounded-lg p-6 mb-6 space-y-4 bg-white">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></div>
            <div>
              <Label>Type</Label>
              <Select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </Select>
            </div>
            <div><Label>Value</Label><Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} required /></div>
            <div><Label>Min Order Amount</Label><Input type="number" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} /></div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Create</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {coupons?.map((c) => (
          <div key={c.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono font-bold text-lg">{c.code}</span>
              <Badge variant={c.is_active ? 'success' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
              {c.min_order_amount > 0 && ` (min ₹${c.min_order_amount})`}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
