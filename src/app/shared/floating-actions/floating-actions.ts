import { Component, inject } from '@angular/core';
import { SiteSettings } from '../../core/services/site-settings';

@Component({
  selector: 'app-floating-actions',
  templateUrl: './floating-actions.html',
})
export class FloatingActions {
  protected readonly site = inject(SiteSettings);
}
