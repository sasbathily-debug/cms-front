import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SiteSettings } from '../../../core/services/site-settings';

const MOTIFS = ['Rendez-vous', "Résultats d'analyses", 'Question sur un traitement', 'Autre'];

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, PublicPage, PageHero, CtaBand],
  templateUrl: './contact.html',
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  protected readonly site = inject(SiteSettings);

  readonly motifs = MOTIFS;
  readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: 'Contact' }];

  readonly form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    motif: [MOTIFS[0]],
    message: ['', Validators.required],
    consent: [false, Validators.requiredTrue],
  });

  readonly hours = [
    { jour: 'Lundi au vendredi', heures: '9h00 – 17h30' },
    { jour: 'Samedi', heures: '9h00 – 13h00' },
    { jour: 'Dimanche', heures: 'Fermé' },
  ];

  /** Le formulaire ouvre l'application de messagerie avec le message prérempli. */
  get mailtoHref(): string {
    const v = this.form.getRawValue();
    const subject = `Contact du site : ${v.motif}`;
    const body = `Nom : ${v.name}\nTéléphone : ${v.phone}\nE-mail : ${v.email || '-'}\n\n${v.message}`;
    return `mailto:${this.site.email()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  setMotif(motif: string): void {
    this.form.patchValue({ motif });
  }

  send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    window.location.href = this.mailtoHref;
  }
}
