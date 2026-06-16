import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Calendar, BarChart, PieChart, LineChart } from 'lucide-react'

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Business Reports</h2>
          <p className="text-muted-foreground">Analyze sales performance, inventory turnover, and customer growth.</p>
        </div>
        <Button className="gap-2" variant="outline">
          <Download className="h-4 w-4" /> Export All Data
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Sales Summary', desc: 'Monthly and yearly revenue breakdowns.', icon: BarChart },
          { title: 'Inventory Analytics', desc: 'Stock levels and turnover rates.', icon: PieChart },
          { title: 'Customer Growth', desc: 'New registration and retention metrics.', icon: LineChart },
        ].map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                <report.icon className="h-6 w-6" />
              </div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.desc}</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="link" className="px-0 text-primary h-auto font-bold">View Full Report</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Generated Reports</CardTitle>
          <CardDescription>History of scheduled and manual exports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Monthly_Sales_May_2026.pdf', date: 'June 1, 2026', size: '2.4 MB' },
              { name: 'Inventory_Audit_Q2.xlsx', date: 'May 15, 2026', size: '1.1 MB' },
              { name: 'Customer_Lifetime_Value_v2.csv', date: 'May 10, 2026', size: '890 KB' },
            ].map((file) => (
              <div key={file.name} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 text-primary"><BarChart className="h-full w-full" /></div>
                  <div>
                    <p className="text-sm font-semibold">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{file.date} • {file.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Download</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
