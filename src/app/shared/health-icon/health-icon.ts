import { Component, computed, input } from '@angular/core';

export const HEALTH_ICON_NAMES = [
  'droplet',
  'gauge',
  'molecule',
  'heart',
  'activity',
  'brain',
  'eye',
  'bone',
  'pill',
  'stethoscope',
  'shield',
  'leaf',
] as const;

export type HealthIconName = (typeof HEALTH_ICON_NAMES)[number];

function normalize(name: string | null | undefined): HealthIconName | null {
  if (!name) {
    return null;
  }
  const key = name.trim().toLowerCase();
  return (HEALTH_ICON_NAMES as readonly string[]).includes(key) ? (key as HealthIconName) : null;
}

@Component({
  selector: 'app-health-icon',
  styleUrl: './health-icon.css',
  templateUrl: './health-icon.html',
})
export class HealthIcon {
  readonly name = input<string | null>(null);
  readonly size = input(24);
  readonly color = input('#A9611E');

  readonly resolved = computed(() => normalize(this.name()));
}
