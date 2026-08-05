import { useEffect, useState } from "react"

import { getProfileStats } from "@/shared/api/profile"
import { getCurrentUser } from "@/shared/api/auth"
import type { ProfileStats } from "@/shared/api/types"
import type { User } from "@/shared/api/auth"
import { ProfileHeader } from "@/components/ProfilePage/ProfileHeader"
import { ProfileStatsGrid } from "@/components/ProfilePage/ProfileStatsGrid"
import { ActivityHeatmap } from "@/components/ProfilePage/ActivityHeatmap"
import { Button } from "@/components/ui/button"
import { ChangeEmailDialog } from "@/components/ProfilePage/ChangeEmailDialog"
import { ChangePasswordDialog } from "@/components/ProfilePage/ChangePasswordDialog"

export function ProfilePage() {
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [emailOpen, setEmailOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [stats, currentUser] = await Promise.all([
          getProfileStats(),
          getCurrentUser(),
        ])
        setProfileStats(stats)
        setUser(currentUser)
      } catch (error) {
        console.error("Failed to load profile data:", error)
      }
    }

    loadData()
  }, [])

  if (!profileStats || !user) {
    return <div className="p-8">Загрузка...</div>
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <ProfileHeader profile={profileStats} />

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}>
          Изменить email
        </Button>
        <Button size="sm" variant="outline" onClick={() => setPasswordOpen(true)}>
          Изменить пароль
        </Button>
      </div>

      <ProfileStatsGrid stats={profileStats} />

      <ActivityHeatmap data={profileStats.heatmap} />

      <ChangeEmailDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        currentEmail={user.email}
        onSuccess={(email) => setUser((prev) => prev && { ...prev, email })}
      />
      <ChangePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      />
    </div>
  )
}
