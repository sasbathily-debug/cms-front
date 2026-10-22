import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OpeningHours } from '../../../core/services/opening-hours';
import { OpenNow } from '../../../shared/open-now/open-now';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SiteSettings } from '../../../core/services/site-settings';
import { ContactService } from '../../../core/services/contact';

const MOTIFS = ['Rendez-vous', "Résultats d'analyses", 'Question sur un traitement', 'Autre'];

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, OpenNow, PublicPage, PageHero, CtaBand],
  templateUrl: './contact.html',
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  protected readonly site = inject(SiteSettings);
  private readonly contact = inject(ContactService);

  readonly motifs = MOTIFS;
  readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: 'Contact' }];

  readonly form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.email],
    motif: [MOTIFS[0]],
    message: ['', Validators.required],
    consent: [false, Validators.requiredTrue],
    // Piège à robots : caché, jamais rempli par un visiteur.
    website: [''],
  });

  readonly status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  readonly errorText = signal('');

  protected readonly openingHours = inject(OpeningHours);

  /** Solution de repli si l'envoi échoue : ouvre l'application de messagerie avec le message prérempli. */
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
    if (this.status() === 'sending') {
      return;
    }
    const v = this.form.getRawValue();
    this.status.set('sending');
    this.errorText.set('');
    this.contact
      .send({
        name: (v.name ?? '').trim(),
        phone: (v.phone ?? '').trim(),
        email: (v.email ?? '').trim() || null,
        motif: v.motif ?? MOTIFS[MOTIFS.length - 1],
        message: (v.message ?? '').trim(),
        consent: v.consent === true,
        website: v.website ?? '',
      })
      .subscribe({
        next: () => this.status.set('sent'),
        error: (error: HttpErrorResponse) => {
          const tooMany = error.status === 429;
          this.errorText.set(
            tooMany
              ? 'Vous avez envoyé plusieurs messages à la suite. Réessayez dans un moment, ou appelez le cabinet.'
              : "Votre message n'a pas pu être envoyé. Appelez le cabinet ou écrivez-nous sur WhatsApp.",
          );
          this.status.set('error');
        },
      });
  }

  /** Après un envoi réussi : on repart d'un formulaire vide. */
  reset(): void {
    this.form.reset({ motif: MOTIFS[0], consent: false, website: '' });
    this.status.set('idle');
    this.errorText.set('');
  }
}
