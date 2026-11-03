import { Component, computed, input, output, signal } from '@angular/core';
import { UserDto } from '../../core/models/user.models';

@Component({
  selector: 'app-patient-picker',
  styleUrl: './patient-picker.css',
  templateUrl: './patient-picker.html',
})
export class PatientPicker {
  readonly patients = input.required<UserDto[]>();
  readonly patientSelected = output<UserDto | null>();

  readonly query = signal('');
  readonly open = signal(false);
  readonly selected = signal<UserDto | null>(null);

  readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.patients();
    const filtered = q
      ? list.filter(
          (p) =>
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q),
        )
      : list;
    return filtered.slice(0, 8);
  });

  onInput(value: string): void {
    this.query.set(value);
    this.open.set(true);
    if (this.selected()) {
      this.selected.set(null);
      this.patientSelected.emit(null);
    }
  }

  onFocus(): void {
    this.open.set(true);
  }

  onBlur(): void {
    setTimeout(() => this.open.set(false), 150);
  }

  pick(patient: UserDto): void {
    this.selected.set(patient);
    this.query.set(`${patient.firstName} ${patient.lastName}`);
    this.open.set(false);
    this.patientSelected.emit(patient);
  }

  clear(): void {
    this.selected.set(null);
    this.query.set('');
    this.patientSelected.emit(null);
  }
}
