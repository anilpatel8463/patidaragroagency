import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Pencil, FolderTree } from 'lucide-react'
import { adminApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { Category } from '@/types'

export function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '', image_url: '' })
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: () => adminApi.categories.list().then((r) => r.data.data),
  })

  const mutation = useMutation({
    mutationFn: (data: Partial<Category>) => editing ? adminApi.categories.update(editing.id, data) : adminApi.categories.create(data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['admin-categories-list'] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.categories.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories-list'] }),
  })

  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ name: '', description: '', image_url: '' })
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '' })
    setShowForm(true)
  }

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Categories</h2>
          <p className="text-muted-foreground">Organize your products into logical groups for better browsing.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {showForm && (
        <Card className="border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle>{editing ? 'Edit Category' : 'Create New Category'}</CardTitle>
            <CardDescription>Specify the name and description for this group.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form) }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Organic Fertilizers" />
                </div>
                <div className="space-y-2">
                  <Label>Image URL (Optional)</Label>
                  <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What kinds of products belong here?" />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((cat) => (
          <Card key={cat.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group">
            <div className="h-32 bg-gray-50 flex items-center justify-center border-b relative group">
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <FolderTree className="h-10 w-10 text-gray-200" />
              )}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                   <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">{cat.name}</h3>
                   <div className="flex items-center gap-2">
                       <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">SLUG: {cat.slug}</span>
                       <Badge variant="outline" className="text-[10px] h-4 px-1 leading-none uppercase font-bold border-emerald-100 text-emerald-600 bg-emerald-50">Active</Badge>
                   </div>
                </div>
                <div className="flex gap-1.5">
                   <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-gray-200 hover:border-primary hover:text-primary transition-all" onClick={() => handleEdit(cat)}>
                      <Pencil className="h-4 w-4" />
                   </Button>
                   <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-gray-200 hover:border-red-500 hover:text-red-500 transition-all" onClick={() => {
                      if (confirm(`Delete category "${cat.name}"? This action cannot be undone.`)) {
                         deleteMutation.mutate(cat.id)
                      }
                   }}>
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed min-h-[40px] italic">
                 {cat.description || 'No description provided for this category.'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-white rounded-xl border border-dashed">
          <FolderTree className="h-12 w-12 text-muted-foreground/20" />
          <p className="text-muted-foreground font-medium">No categories found. Start by creating one!</p>
          <Button onClick={() => setShowForm(true)}>Add your first category</Button>
        </div>
      )}
    </div>
  )
}
