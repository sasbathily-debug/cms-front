import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettings } from '../../core/services/site-settings';
import { OpeningHours } from '../../core/services/opening-hours';
import { SPECIALTY_LINKS } from '../../core/site-nav';
import { OpenNow } from '../open-now/open-now';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, OpenNow],
  styleUrl: './app-footer.css',
  templateUrl: './app-footer.html',
})
export class AppFooter {
  protected readonly site = inject(SiteSettings);

  readonly year = new Date().getFullYear();
  readonly instagramUrl = 'https://www.instagram.com/dr_aissatou.m/';
  readonly specialties = [
    SPECIALTY_LINKS[0],
    SPECIALTY_LINKS[1],
    SPECIALTY_LINKS[2],
    SPECIALTY_LINKS[4],
  ];
  readonly mapsUrl = 'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125';

  protected readonly addressLines = computed(() => [
    this.site.street(),
    `${this.site.address()}, Sénégal`,
  ]);
  protected readonly hours = inject(OpeningHours);
}
