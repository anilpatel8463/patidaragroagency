import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Package, CheckCircle2, Circle } from 'lucide-react'
import { orderApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { formatDate, formatStatus } from '@/lib/utils'

export function TrackingPage() {
  const { trackingNumber: paramTracking } = useParams()
  const [trackingInput, setTrackingInput] = useState(paramTracking || '')
  const [searchNumber, setSearchNumber] = useState(paramTracking || '')
  const navigate = useNavigate()

  const { data: tracking, isLoading, error } = useQuery({
    queryKey: ['track', searchNumber],
    queryFn: () => orderApi.track(searchNumber).then((r) => r.data.data),
    enabled: !!searchNumber,
    retry: false,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingInput.trim()) {
      setSearchNumber(trackingInput.trim())
      navigate(`/track/${trackingInput.trim()}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-2">Track Your Order</h1>
      <p className="text-muted-foreground text-center mb-8">Enter your tracking number to see delivery status</p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          placeholder="Enter tracking number (e.g., TRK...)"
          value={trackingInput}
          onChange={(e) => setTrackingInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit"><Search className="h-4 w-4 mr-1" /> Track</Button>
      </form>

      {isLoading && <Spinner className="py-12" />}

      {searchNumber && !isLoading && error && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Tracking number not found. Please check and try again.</p>
        </div>
      )}

      {tracking && (
        <div className="border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Tracking Number</p>
              <p className="font-mono font-bold text-lg">{tracking.tracking_number || 'Not Shipped Yet'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order</p>
              <p className="font-medium">{tracking.order_number}</p>
            </div>
          </div>

          <div className="bg-agro-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Current Status</p>
            <p className="text-xl font-bold text-agro-700">{formatStatus(tracking.order_status)}</p>
            {tracking.estimated_delivery && (
              <p className="text-sm text-muted-foreground mt-1">Estimated Delivery: {formatDate(tracking.estimated_delivery)}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shipment Timeline</h3>
            <div className="space-y-4">
              {tracking.timeline.map((event, i) => (
                <div key={i} className="flex gap-3">
                  {i === tracking.timeline.length - 1 ? (
                    <CheckCircle2 className="h-5 w-5 text-agro-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-agro-300 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{formatStatus(event.status)}</p>
                    {event.note && <p className="text-xs text-muted-foreground">{event.note}</p>}
                    <p className="text-xs text-muted-foreground">{formatDate(event.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2 text-sm">Delivery Address</h3>
            <p className="text-sm">{tracking.shipping_address.full_name}</p>
            <p className="text-sm text-muted-foreground">{tracking.shipping_address.address}, {tracking.shipping_address.city}</p>
          </div>
        </div>
      )}
    </div>
  )
}
