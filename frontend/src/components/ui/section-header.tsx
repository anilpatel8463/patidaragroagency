import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  badge?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({ badge, title, subtitle, align = 'center', className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 md:mb-16', align === 'center' && 'text-center', className)}>
      {badge && (
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase bg-agro-100 text-agro-700 rounded-full">
          {badge}
        </span>
      )}
      <h2 className={cn('section-heading', align === 'center' && 'mx-auto')}>{title}</h2>
      {subtitle && (
        <p className={cn('section-subheading mt-4', align === 'center' && 'mx-auto')}>{subtitle}</p>
      )}
    </div>
  )
}
