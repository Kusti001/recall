import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminFeedbackTab } from "@/components/AdminPage/AdminFeedbackTab"
import { AdminOverviewTab } from "@/components/AdminPage/AdminOverviewTab"
import { AdminAnalyticsTab } from "@/components/AdminPage/AdminAnalyticsTab"

export function AdminPage() {
  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="feedback">Обратная связь</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <AdminOverviewTab />
      </TabsContent>

      <TabsContent value="analytics">
        <AdminAnalyticsTab />
      </TabsContent>

      <TabsContent value="feedback">
        <AdminFeedbackTab />
      </TabsContent>
    </Tabs>
  )
}
