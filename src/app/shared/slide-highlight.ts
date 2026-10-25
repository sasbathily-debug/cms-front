import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Fond qui glisse d'une ligne à l'autre dans une liste de liens, au lieu de s'allumer et s'éteindre ligne par ligne.
 * L'élément doit être `relative` et contenir un `<span data-hl>` (le fond) suivi des liens (`<a>`, `z-index` au-dessus).
 */
@Directive({
  selector: '[appSlideHighlight]',
  host: {
    '(mouseover)': 'move($event)',
    '(focusin)': 'move($event)',
    '(mouseleave)': 'hide()',
    '(focusout)': 'hide()',
  },
})
export class SlideHighlight {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected move(event: Event): void {
    const link = (event.target as HTMLElement).closest('a');
    const bg = this.host.querySelector<HTMLElement>('[data-hl]');
    if (!link || !bg || !this.host.contains(link)) return;
    const box = this.host.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    bg.style.width = `${rect.width}px`;
    bg.style.height = `${rect.height}px`;
    bg.style.transform = `translate(${rect.left - box.left}px, ${rect.top - box.top}px)`;
    bg.style.opacity = '1';
  }

  protected hide(): void {
    const bg = this.host.querySelector<HTMLElement>('[data-hl]');
    if (bg) bg.style.opacity = '0';
  }
}
