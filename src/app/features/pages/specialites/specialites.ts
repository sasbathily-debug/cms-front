import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SilhouetteSpecialties } from '../../../shared/silhouette-specialties/silhouette-specialties';
import { Specialties } from '../../../core/services/specialties';

@Component({
  selector: 'app-specialites',
  imports: [RouterLink, PublicPage, CtaBand, SilhouetteSpecialties],
  templateUrl: './specialites.html',
})
export class Specialites {
  private readonly all = inject(Specialties);
  protected readonly c = this.all.content;
  readonly specialties = this.all.list;
}
