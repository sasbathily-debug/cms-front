import { Service, Signal, computed, inject } from '@angular/core';
import { PageContent } from './page-content';
import { SPECIALITES } from '../page-content/defs/specialites';
import { SPECIALTIES, Specialty } from '../specialties';

/** Les spécialités avec les textes saisis dans l'admin ; la clé, le numéro et la page viennent du site. */
@Service()
export class Specialties {
  readonly content = inject(PageContent).use(SPECIALITES);

  readonly list: Signal<Specialty[]> = computed(() =>
    SPECIALTIES.map((fixed, i) => ({ ...fixed, ...this.content().items[i] })),
  );
}
