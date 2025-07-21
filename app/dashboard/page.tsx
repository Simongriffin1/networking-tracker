import { FollowUpReminder } from '@/components/follow-up-reminder'
import { RecentInteractions } from '@/components/recent-interactions'
import { ContactStats } from '@/components/contact-stats'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your professional relationships and upcoming follow-ups
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ContactStats />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FollowUpReminder />
        <RecentInteractions />
      </div>
    </div>
  )
} 