import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SiteContentService } from '../../../core/services/site-content';
import { PageContent } from '../../../core/services/page-content';
import { FileUploadService } from '../../../core/services/file-upload';
import {
  Field,
  PageDef,
  emptyItem,
  getIn,
  mergeContent,
  moveItem,
  setIn,
} from '../../../core/page-content/fields';
import { pageBySlug } from '../../../core/page-content/pages';

type Path = readonly (string | number)[];

/** Formulaire généré à partir des champs de la page : textes, paragraphes, listes de blocs. */
@Component({
  selector: 'app-admin-page-editor',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './admin-page-editor.html',
})
export class AdminPageEditor implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly content = inject(SiteContentService);
  private readonly pageContent = inject(PageContent);
  private readonly uploads = inject(FileUploadService);

  protected readonly def = signal<PageDef<object> | null>(null);
  protected readonly draft = signal<Record<string, unknown>>({});
  private readonly initial = signal('');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  /** Adresse (id du champ) de l'image en cours d'envoi. */
  protected readonly uploading = signal<string | null>(null);
  protected readonly message = signal<{ ok: boolean; text: string } | null>(null);

  protected readonly dirty = computed(() => JSON.stringify(this.draft()) !== this.initial());

  ngOnInit(): void {
    const def = pageBySlug(this.route.snapshot.paramMap.get('slug') ?? '');
    if (!def) {
      void this.router.navigate(['/admin/pages']);
      return;
    }
    this.def.set(def);
    this.content.getPage(def.slug).subscribe({
      next: (page) => this.start(def, page.content),
      error: () => this.start(def, null),
    });
  }

  private start(def: PageDef<object>, saved: Record<string, unknown> | null): void {
    const merged = mergeContent(def.defaults, saved) as Record<string, unknown>;
    this.draft.set(merged);
    this.initial.set(JSON.stringify(merged));
    this.loading.set(false);
  }

  // ----- Lecture -----

  protected text(path: Path): string {
    const value = getIn(this.draft(), path);
    return typeof value === 'string' ? value : '';
  }

  protected list(path: Path): unknown[] {
    const value = getIn(this.draft(), path);
    return Array.isArray(value) ? value : [];
  }

  protected rows(path: Path): number {
    return Math.max(3, Math.ceil(this.text(path).length / 70) + 1);
  }

  protected id(path: Path): string {
    return 'champ-' + path.join('-');
  }

  protected child(path: Path, key: string | number): Path {
    return [...path, key];
  }

  /** Titre d'un bloc d'une liste : son premier texte renseigné, sinon « Élément n ». */
  protected itemTitle(
    path: Path,
    index: number,
    fields: Field[],
    itemLabel: string,
    titleKey?: string,
  ): string {
    const item = getIn(this.draft(), [...path, index]);
    const key = titleKey ?? fields.find((f) => f.type === 'text')?.key;
    const raw = key ? getIn(item, [key]) : '';
    const value = typeof raw === 'string' ? raw : '';
    return value.trim()
      ? `${index + 1}. ${value.trim().slice(0, 60)}`
      : `${index + 1}. ${itemLabel}`;
  }

  // ----- Modification -----

  protected setValue(path: Path, value: unknown): void {
    this.message.set(null);
    this.draft.update((draft) => setIn(draft, path, value));
  }

  protected addItem(path: Path, fields: Field[]): void {
    this.setValue(path, [...this.list(path), emptyItem(fields)]);
  }

  protected addString(path: Path): void {
    this.setValue(path, [...this.list(path), '']);
  }

  protected removeAt(path: Path, index: number): void {
    this.setValue(
      path,
      this.list(path).filter((_, i) => i !== index),
    );
  }

  protected moveAt(path: Path, index: number, direction: -1 | 1): void {
    this.setValue(path, moveItem(this.list(path), index, index + direction));
  }

  /** Envoie une image choisie sur l'ordinateur et en met l'adresse dans le champ. */
  protected uploadImage(event: Event, path: Path): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploading.set(this.id(path));
    this.uploads.upload(file).subscribe({
      next: (res) => {
        this.setValue(path, res.url);
        this.uploading.set(null);
      },
      error: () => {
        this.uploading.set(null);
        this.message.set({ ok: false, text: "L'image n'a pas pu être envoyée. Réessayez." });
      },
    });
    input.value = '';
  }

  // ----- Enregistrement -----

  protected save(): void {
    const def = this.def();
    if (!def || this.saving()) return;
    this.saving.set(true);
    this.message.set(null);
    this.content.savePage(def.slug, this.draft()).subscribe({
      next: (page) => {
        this.pageContent.setSaved(def.slug, page.content);
        this.initial.set(JSON.stringify(this.draft()));
        this.saving.set(false);
        this.message.set({ ok: true, text: 'Page enregistrée. Elle est à jour sur le site.' });
      },
      error: (err) => {
        this.saving.set(false);
        this.message.set({
          ok: false,
          text: err?.error?.message ?? "La page n'a pas pu être enregistrée. Réessayez.",
        });
      },
    });
  }

  protected resetToOriginal(): void {
    const def = this.def();
    if (!def || this.saving()) return;
    if (
      !window.confirm(
        "Rétablir les textes d'origine de cette page ? Vos modifications seront perdues.",
      )
    ) {
      return;
    }
    this.saving.set(true);
    this.content.resetPage(def.slug).subscribe({
      next: () => {
        this.pageContent.setSaved(def.slug, null);
        this.start(def, null);
        this.saving.set(false);
        this.message.set({ ok: true, text: "Les textes d'origine sont rétablis." });
      },
      error: () => {
        this.saving.set(false);
        this.message.set({ ok: false, text: "Les textes d'origine n'ont pas pu être rétablis." });
      },
    });
  }
}
