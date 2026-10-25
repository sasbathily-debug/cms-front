import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { SPECIALTY_LINKS } from '../../../core/site-nav';

export interface PlanLink {
  label: string;
  route: string;
  hint?: string;
}

export interface PlanGroup {
  titre: string;
  links: PlanLink[];
}

/** Toutes les pages publiques du site, regroupées. Une page ajoutée au site se déclare ici aussi. */
export const PLAN: PlanGroup[] = [
  {
    titre: 'Le cabinet',
    links: [
      { label: 'Accueil', route: '/' },
      { label: 'À propos', route: '/a-propos', hint: 'La doctoresse et son parcours' },
      { label: 'Le cabinet', route: '/le-cabinet', hint: 'Le lieu et ceux qui vous accueillent' },
      {
        label: 'Infos pratiques et accès',
        route: '/infos-pratiques',
        hint: 'Adresse, horaires, tarifs',
      },
      { label: 'Contact', route: '/contact' },
    ],
  },
  {
    titre: 'Spécialités',
    links: [
      { label: 'Toutes les spécialités', route: '/specialites' },
      ...SPECIALTY_LINKS.map(({ label, route }) => ({ label, route })),
    ],
  },
  {
    titre: 'Patients',
    links: [
      { label: 'Prendre rendez-vous', route: '/rendez-vous' },
      {
        label: 'Première consultation',
        route: '/premiere-consultation',
        hint: 'Bien préparer votre visite',
      },
      { label: 'Conseils santé', route: '/conseils-sante' },
      { label: 'Questions fréquentes', route: '/faq' },
      { label: 'Mon espace', route: '/client', hint: 'Vos rendez-vous et vos documents' },
      { label: 'Créer un compte', route: '/register' },
      { label: 'Se connecter', route: '/login' },
    ],
  },
  {
    titre: 'Informations légales',
    links: [
      { label: 'Mentions légales', route: '/mentions-legales' },
      { label: 'Politique de confidentialité', route: '/politique-de-confidentialite' },
      { label: 'Plan du site', route: '/plan-du-site' },
    ],
  },
];

/** Plan du site : la liste de toutes les pages publiques. */
@Component({
  selector: 'app-plan-du-site',
  imports: [RouterLink, PublicPage, PageHero],
  template: `
    <app-public-page>
      <app-page-hero
        [crumbs]="crumbs"
        title="Plan du site"
        lead="Toutes les pages du site, au même endroit."
      />
      <section class="px-4 pb-24 pt-16 sm:px-6 lg:px-10 lg:pt-[72px]">
        <div class="mx-auto grid max-w-[1160px] gap-x-14 gap-y-12 sm:grid-cols-2">
          @for (group of plan; track group.titre) {
            <section class="flex flex-col gap-4">
              <h2
                class="m-0 font-display text-[1.75rem] font-bold leading-[1.1] tracking-[-0.02em] text-fg"
              >
                {{ group.titre }}
              </h2>
              <ul class="m-0 flex list-none flex-col p-0">
                @for (link of group.links; track link.route) {
                  <li class="border-b border-line">
                    <a
                      [routerLink]="link.route"
                      class="flex flex-col gap-0.5 py-3.5 text-[17px] font-semibold text-accent-800 hover:underline"
                      >{{ link.label }}
                      @if (link.hint) {
                        <span class="text-[14px] font-normal text-muted">{{ link.hint }}</span>
                      }
                    </a>
                  </li>
                }
              </ul>
            </section>
          }
        </div>
      </section>
    </app-public-page>
  `,
})
export class PlanDuSite {
  protected readonly plan = PLAN;
  protected readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: 'Plan du site' }];
}
