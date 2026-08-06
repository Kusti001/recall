import { useTranslation } from "react-i18next"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <Select
      value={i18n.language}
      onValueChange={(value) => i18n.changeLanguage(value)}
    >
      <SelectTrigger className="w-auto">
        <SelectValue />
      </SelectTrigger>

      <SelectContent
        position="popper"
        className="animate-in duration-150 fade-in-0 zoom-in-95 slide-in-from-top-1"
      >
        <SelectItem value="ru">Русский</SelectItem>

        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  )
}
