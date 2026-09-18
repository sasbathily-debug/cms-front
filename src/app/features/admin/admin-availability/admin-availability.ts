import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvailabilityService } from '../../../core/services/availability';
import { AvailabilityRuleDto, DayOfWeek, ScheduleExceptionDto } from '../../../core/models/availability.models';

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
  SUNDAY: 'Dimanche',
};

const DAY_ORDER: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

@Component({
  selector: 'app-admin-availability',
  imports: [ReactiveFormsModule],
  styleUrl: './admin-availability.css',
  templateUrl: './admin-availability.html',
})
export class AdminAvailability implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly availabilityService = inject(AvailabilityService);

  readonly dayOrder = DAY_ORDER;
  readonly dayLabel = (day: DayOfWeek) => DAY_LABELS[day];

  readonly rules = signal<AvailabilityRuleDto[]>([]);
  readonly exceptions = signal<ScheduleExceptionDto[]>([]);
  readonly loading = signal(true);
  readonly savingRule = signal(false);
  readonly savingException = signal(false);
  readonly deletingRuleId = signal<string | null>(null);
  readonly deletingExceptionId = signal<string | null>(null);

  readonly ruleForm = this.fb.group({
    dayOfWeek: ['MONDAY' as DayOfWeek, [Validators.required]],
    startTime: ['09:00', [Validators.required]],
    endTime: ['12:30', [Validators.required]],
    slotDurationMinutes: [30, [Validators.required]],
  });

  readonly exceptionForm = this.fb.group({
    date: ['', [Validators.required]],
    closed: [true],
    customStartTime: [''],
    customEndTime: [''],
    slotDurationMinutes: [30],
    note: [''],
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.availabilityService.getRules().subscribe({ next: (rules) => this.rules.set(rules) });
    this.availabilityService.getExceptions().subscribe({
      next: (exceptions) => {
        this.exceptions.set(exceptions);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  rulesForDay(day: DayOfWeek): AvailabilityRuleDto[] {
    return this.rules().filter((r) => r.dayOfWeek === day);
  }

  submitRule(): void {
    if (this.ruleForm.invalid) {
      this.ruleForm.markAllAsTouched();
      return;
    }
    this.savingRule.set(true);
    const value = this.ruleForm.getRawValue();
    this.availabilityService
      .createRule({
        dayOfWeek: value.dayOfWeek!,
        startTime: value.startTime!,
        endTime: value.endTime!,
        slotDurationMinutes: value.slotDurationMinutes!,
      })
      .subscribe({
        next: () => {
          this.savingRule.set(false);
          this.refresh();
        },
        error: () => this.savingRule.set(false),
      });
  }

  deleteRule(rule: AvailabilityRuleDto): void {
    this.deletingRuleId.set(rule.id);
    this.availabilityService.deleteRule(rule.id).subscribe({
      next: () => {
        this.deletingRuleId.set(null);
        this.refresh();
      },
      error: () => this.deletingRuleId.set(null),
    });
  }

  submitException(): void {
    if (this.exceptionForm.invalid) {
      this.exceptionForm.markAllAsTouched();
      return;
    }
    this.savingException.set(true);
    const value = this.exceptionForm.getRawValue();
    this.availabilityService
      .createException({
        date: value.date!,
        closed: value.closed!,
        customStartTime: value.closed ? null : value.customStartTime || null,
        customEndTime: value.closed ? null : value.customEndTime || null,
        slotDurationMinutes: value.closed ? null : value.slotDurationMinutes,
        note: value.note || null,
      })
      .subscribe({
        next: () => {
          this.savingException.set(false);
          this.exceptionForm.reset({ closed: true, slotDurationMinutes: 30 });
          this.refresh();
        },
        error: () => this.savingException.set(false),
      });
  }

  deleteException(exception: ScheduleExceptionDto): void {
    this.deletingExceptionId.set(exception.id);
    this.availabilityService.deleteException(exception.id).subscribe({
      next: () => {
        this.deletingExceptionId.set(null);
        this.refresh();
      },
      error: () => this.deletingExceptionId.set(null),
    });
  }
}
