import { Component, computed, effect, input, output, signal, untracked } from '@angular/core';
import { AvailableSlotDto } from '../../core/models/availability.models';

interface DayChip {
  date: string;
  weekday: string;
  day: string;
  month: string;
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });
const MONTH_FORMATTER = new Intl.DateTimeFormat('fr-FR', { month: 'short' });

@Component({
  selector: 'app-slot-picker',
  styleUrl: './slot-picker.css',
  templateUrl: './slot-picker.html',
})
export class SlotPicker {
  readonly slots = input.required<AvailableSlotDto[]>();
  readonly loading = input(false);
  readonly initialDate = input<string | null>(null);
  readonly initialTime = input<string | null>(null);
  readonly slotSelected = output<{ date: string; time: string }>();

  private readonly slotsByDate = computed<Map<string, string[]>>(() => {
    const map = new Map<string, string[]>();
    for (const slot of this.slots()) {
      const list = map.get(slot.date) ?? [];
      list.push(slot.time);
      map.set(slot.date, list);
    }
    return map;
  });

  /** Les jours s'affichent par groupes de cinq, comme sur la maquette. */
  private readonly pageSize = 5;
  readonly dayPage = signal(0);

  readonly selectedDate = signal<string | null>(null);
  readonly selectedTime = signal<string | null>(null);

  readonly dayChips = computed<DayChip[]>(() =>
    Array.from(this.slotsByDate().keys()).map((date) => {
      const d = new Date(`${date}T00:00:00`);
      return {
        date,
        weekday: capitalize(WEEKDAY_FORMATTER.format(d).replace('.', '')),
        day: String(d.getDate()),
        month: capitalize(MONTH_FORMATTER.format(d).replace('.', '')),
      };
    }),
  );

  readonly visibleChips = computed(() => {
    const start = this.dayPage() * this.pageSize;
    return this.dayChips().slice(start, start + this.pageSize);
  });
  readonly canGoBack = computed(() => this.dayPage() > 0);
  readonly canGoForward = computed(
    () => (this.dayPage() + 1) * this.pageSize < this.dayChips().length,
  );

  changeDayPage(delta: number): void {
    this.dayPage.update((page) => Math.max(0, page + delta));
  }

  readonly timesForSelectedDate = computed(() => {
    const date = this.selectedDate();
    return date ? (this.slotsByDate().get(date) ?? []) : [];
  });

  readonly hasSlots = computed(() => this.dayChips().length > 0);

  private lastAppliedPreselect: string | null = null;

  constructor() {
    effect(() => {
      const map = this.slotsByDate();
      const preselectDate = this.initialDate();
      const preselectTime = this.initialTime();

      if (map.size === 0) {
        return;
      }

      untracked(() => {
        const alreadySelected = this.selectedDate();

        if (!alreadySelected) {
          if (preselectDate && map.has(preselectDate)) {
            this.applySelection(preselectDate, preselectTime, map);
          } else {
            this.selectDate(Array.from(map.keys())[0]);
          }
          this.lastAppliedPreselect = preselectDate;
          return;
        }

        if (
          preselectDate &&
          preselectDate !== this.lastAppliedPreselect &&
          map.has(preselectDate)
        ) {
          this.applySelection(preselectDate, preselectTime, map);
          this.lastAppliedPreselect = preselectDate;
        }
      });
    });
  }

  private applySelection(date: string, time: string | null, map: Map<string, string[]>): void {
    this.selectDate(date);
    if (time && map.get(date)!.includes(time)) {
      this.selectTime(time);
    }
  }

  selectDate(date: string): void {
    this.selectedDate.set(date);
    this.selectedTime.set(null);
  }

  selectTime(time: string): void {
    this.selectedTime.set(time);
    const date = this.selectedDate();
    if (date) {
      this.slotSelected.emit({ date, time });
    }
  }

  formatTime(time: string): string {
    return time.slice(0, 5);
  }
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
