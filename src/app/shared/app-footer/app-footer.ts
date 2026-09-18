import { Component, computed, input } from '@angular/core';
import { SiteSettingsDto } from '../../core/models/site-content.models';

@Component({
  selector: 'app-footer',
  styleUrl: './app-footer.css',
  templateUrl: './app-footer.html',
})
export class AppFooter {
  readonly settings = input<SiteSettingsDto | null>(null);

  readonly year = new Date().getFullYear();

  readonly address = computed(() => this.settings()?.address || 'Sacré-Cœur, Dakar');
  readonly phone = computed(() => this.settings()?.phone || '[Téléphone du cabinet]');
  readonly email = computed(() => this.settings()?.email || '[Email du cabinet]');
}
