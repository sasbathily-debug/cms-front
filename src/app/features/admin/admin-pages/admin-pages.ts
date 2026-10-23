import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../../core/services/site-content';
import { PAGES } from '../../../core/page-content/pages';

/** Liste des pages dont les textes se modifient depuis l'admin. */
@Component({
  selector: 'app-admin-pages',
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-pages.html',
})
export class AdminPages implements OnInit {
  private readonly content = inject(SiteContentService);

  protected readonly pages = PAGES;
  protected readonly loading = signal(true);
  /** Date de la dernière modification par page (absente si la page n'a jamais été modifiée). */
  protected readonly modified = signal<Record<string, string>>({});

  ngOnInit(): void {
    this.content.listPages().subscribe({
      next: (list) => {
        this.modified.set(Object.fromEntries(list.map((p) => [p.slug, p.updatedAt])));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
