import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserPlus, Search, Filter, MoreHorizontal, Mail, Phone, Calendar } from 'lucide-react'

const LEADS = [
  { id: '1', name: 'Ramesh Singh', email: 'ramesh@example.com', phone: '+91 98765 43210', source: 'Contact Form', status: 'new', date: '2026-06-12' },
  { id: '2', name: 'Suresh Kumar', email: 'suresh@example.com', phone: '+91 98765 43211', source: 'Bulk Inquiry', status: 'contacted', date: '2026-06-11' },
  { id: '3', name: 'Deepak Patel', email: 'deepak@example.com', phone: '+91 98765 43212', source: 'WhatsApp', status: 'converted', date: '2026-06-10' },
  { id: '4', name: 'Anil Verma', email: 'anil@example.com', phone: '+91 98765 43213', source: 'Direct Call', status: 'lost', date: '2026-06-09' },
]

export function AdminLeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads & Inquiries</h2>
          <p className="text-muted-foreground">Manage potential customers and incoming business inquiries.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> Add Lead
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9" placeholder="Search leads..." />
        </div>
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b text-gray-900 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Contact</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {LEADS.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm">
                    <p className="font-bold text-gray-900">{lead.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                       <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>
                       <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-medium">{lead.source}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant={lead.status === 'new' ? 'warning' : lead.status === 'converted' ? 'success' : lead.status === 'lost' ? 'destructive' : 'secondary'} className="uppercase text-[10px]">
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {lead.date}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
