import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettings } from '../../core/services/site-settings';
import { SPECIALTY_LINKS } from '../../core/site-nav';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  styleUrl: './app-footer.css',
  templateUrl: './app-footer.html',
})
export class AppFooter {
  protected readonly site = inject(SiteSettings);

  readonly year = new Date().getFullYear();
  readonly instagramUrl = 'https://www.instagram.com/dr_aissatou.m/';
  readonly specialties = SPECIALTY_LINKS.slice(0, 5);
  readonly mapsUrl = 'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125';

  get addressLines(): string[] {
    return this.site.address().split(/\n|,\s*(?=Dakar)/);
  }

  get hoursLines(): string[] {
    return this.site.openingHours().split('\n');
  }
}
