import type { CardListItem } from "@/shared/api/api"
import { MoreHorizontalIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "./StatusBadge"

interface CardsTableProps {
  cards: CardListItem[]
  selectedCardId: number | null
  onSelectCard: (card: CardListItem) => void
  onDeleteCard: (card: CardListItem) => void
  onEditCard: (card: CardListItem) => void
}
function formatDate(date: string, locale: string) {
  const value = new Date(date)
  const now = new Date()

  const isToday = value.toDateString() === now.toDateString()

  if (isToday) {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(value)
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value)
}

export function CardsTable({
  cards,
  selectedCardId,
  onSelectCard,
  onDeleteCard,
  onEditCard,
}: CardsTableProps) {
  const { t, i18n } = useTranslation("deck_detail")
  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.front")}</TableHead>
            <TableHead>{t("table.back")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead>{t("table.next_review")}</TableHead>
            <TableHead>{t("table.success_streak")}</TableHead>
            <TableHead>{t("table.total_reviews")}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {cards.map((card) => (
            <TableRow
              key={card.id}
              data-state={selectedCardId === card.id ? "selected" : undefined}
              className="cursor-pointer"
              onClick={() => onSelectCard(card)}
            >
              <TableCell className="max-w-30 truncate font-medium">
                {card.front}
              </TableCell>

              <TableCell className="max-w-30 truncate text-muted-foreground">
                {card.back}
              </TableCell>

              <TableCell>
                <StatusBadge status={card.status} />
              </TableCell>

              <TableCell>
                {formatDate(card.next_review, i18n.language)}
              </TableCell>

              <TableCell>{card.success_streak}</TableCell>

              <TableCell>{card.total_reviews}</TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <MoreHorizontalIcon />
                      <span className="sr-only">{t("open_menu")}</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(event) => {
                        event.stopPropagation()
                        onEditCard(card)
                      }}
                    >
                      {t("edit")}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(event) => {
                        event.stopPropagation()
                        onDeleteCard(card)
                      }}
                    >
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
