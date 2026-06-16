import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search, Filter, MoreVertical, Package, AlertCircle } from 'lucide-react'
import { adminApi, categoryApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { formatPrice, cn } from '@/lib/utils'
import type { Product } from '@/types'

export function AdminProductsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState({ 
    name: '', description: '', price: '', compare_price: '', 
    stock: '', category_id: '', image_url: '', sku: '', 
    is_featured: false, is_active: true, unit: '', weight: '' 
  })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminApi.products.list().then((r) => r.data.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryApi.list().then((r) => r.data.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<Product>) => editing ? adminApi.products.update(editing.id, data) : adminApi.products.create(data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      resetForm() 
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.products.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  })

  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ 
      name: '', description: '', price: '', compare_price: '', 
      stock: '', category_id: '', image_url: '', sku: '', 
      is_featured: false, is_active: true, unit: '', weight: '' 
    })
  }

  const handleEdit = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name, 
      description: product.description || '', 
      price: String(product.price),
      compare_price: String(product.compare_price || ''),
      stock: String(product.stock), 
      category_id: product.category_id || '', 
      image_url: product.image_url || '',
      sku: product.sku || '',
      is_featured: product.is_featured,
      is_active: product.is_active,
      unit: product.unit || '',
      weight: product.weight || '',
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Normalize optional fields: if empty string, send as null/undefined to backend
    const normalizedData = {
      name: form.name, 
      description: form.description || null, 
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      stock: Number(form.stock), 
      category_id: form.category_id || null,
      image_url: form.image_url.trim() || null, 
      sku: form.sku.trim() || null,
      is_featured: form.is_featured,
      is_active: form.is_active,
      unit: form.unit.trim() || null,
      weight: form.weight.trim() || null,
      images: [] // Explicitly send an empty array instead of missing field
    }

    createMutation.mutate(normalizedData as any)
  }

  const filteredItems = data?.items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage your store inventory.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-1" /> Add New Product
        </Button>
      </div>

      {!showForm && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or SKU..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      )}

      {showForm && (
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>{editing ? 'Edit Product' : 'New Product'}</CardTitle>
            <CardDescription>Fill in the details for the product.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Premium White Seeds" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the product benefits..." />
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                    {form.image_url ? (
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <>
                        <Package className="h-10 w-10 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-xs text-muted-foreground font-medium">Add Image URL below</p>
                      </>
                    )}
                  </div>
                  <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL (HTTP/HTTPS)" />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                <div><Label>Compare Price (₹)</Label><Input type="number" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} /></div>
                <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></div>
                <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="AGRO-001" /></div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">Select category</option>
                    {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </div>
                <div><Label>Weight</Label><Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="500g / 5kg" /></div>
                <div><Label>Unit</Label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Pack / Bag / KG" /></div>
                <div className="flex items-center gap-6 pt-8">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
                    <Label htmlFor="is_featured" className="cursor-pointer">Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
                    <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>Discard Changes</Button>
                <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : (editing ? 'Update Product' : 'Create Product')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Product</th>
                <th className="text-left p-4 font-semibold text-gray-900 hidden md:table-cell">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900 hidden md:table-cell">Category</th>
                <th className="text-right p-4 font-semibold text-gray-900">Inventory</th>
                <th className="text-right p-4 font-semibold text-gray-900">Price</th>
                <th className="text-right p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <img src={p.image_url || ''} alt="" className="h-full w-full rounded-lg object-cover bg-gray-100 border border-gray-200" />
                        {p.is_featured && <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 rounded-full border-2 border-white" title="Featured" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate font-mono uppercase tracking-tighter">SKU: {p.sku || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <Badge variant={p.is_active ? 'success' : 'secondary'} className="rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold">
                      {p.is_active ? 'Active' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-muted-foreground">{p.category?.name || '—'}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={cn("font-medium", p.stock < 10 ? "text-red-500 font-bold" : "text-gray-900")}>
                        {p.stock} units
                      </span>
                      {p.stock < 10 && (
                        <span className="text-[10px] text-red-400 flex items-center gap-0.5">
                          <AlertCircle className="h-2 w-2" /> Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-gray-900">
                    {formatPrice(p.price)}
                    {p.compare_price && p.compare_price > p.price && (
                      <p className="text-xs text-muted-foreground line-through font-normal">{formatPrice(p.compare_price)}</p>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                            deleteMutation.mutate(p.id)
                          }
                        }}
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 md:hidden">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <Package className="h-12 w-12 text-muted-foreground/20" />
            <p className="text-muted-foreground font-medium italic">No products found for your search.</p>
            <Button variant="link" onClick={() => setSearchTerm('')}>Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
