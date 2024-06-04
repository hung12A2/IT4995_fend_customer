"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const Calendar = React.forwardRef<HTMLTextAreaElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    return (
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn('p-3', className)}
        classNames={{
          months:
            'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          month: 'space-y-4',
          caption_label: 'text-sm font-medium',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell:
            'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2 ',
          cell: 'text-center text-sm rounded-md p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
          ),
          day_selected:
            'bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground',
          day_today: 'bg-accent text-accent-foreground',
          day_outside: 'text-muted-foreground opacity-50',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle:
            'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
        }}
        {...props}
      />
    )
  }
)

Calendar.displayName = "Calendar"

export { Calendar }
