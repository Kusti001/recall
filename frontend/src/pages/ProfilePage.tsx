import { useEffect, useState } from "react"

import { getProfileStats } from "@/shared/api/profile"
import type { ProfileStats } from "@/shared/api/types"

import { ProfileHeader } from "@/components/ProfilePage/ProfileHeader"
import { ProfileStatsGrid } from "@/components/ProfilePage/ProfileStatsGrid"
import { ActivityHeatmap } from "@/components/ProfilePage/ActivityHeatmap"

export function ProfilePage() {
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null)

  useEffect(() => {
    async function loadProfileStats() {
      const data = await getProfileStats()
      setProfileStats(data)
    }

    loadProfileStats()
  }, [])

  if (!profileStats) {
    return <div className="p-8">Загрузка...</div>
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <ProfileHeader profile={profileStats} />

      <ProfileStatsGrid stats={profileStats} />

      <ActivityHeatmap data={profileStats.heatmap} />
    </div>
  )
}
