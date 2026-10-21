import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SilhouetteSpecialties } from '../../../shared/silhouette-specialties/silhouette-specialties';
import { SPECIALTIES } from '../../../core/specialties';

@Component({
  selector: 'app-specialites',
  imports: [RouterLink, PublicPage, CtaBand, SilhouetteSpecialties],
  templateUrl: './specialites.html',
})
export class Specialites {
  readonly specialties = SPECIALTIES;
}
