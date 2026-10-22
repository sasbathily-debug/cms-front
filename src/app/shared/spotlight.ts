import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Halo orange doux qui suit la souris sur une carte (effet « projecteur »).
 * Seule la souris le déclenche. L'élément doit être positionné (relative, absolute…) ; rien ne bouge,
 * c'est un voile qui s'ajoute par-dessus, donc aucun clic n'est perdu.
 */
@Directive({
  selector: '[appSpotlight]',
  host: { class: 'spot', '(pointermove)': 'move($event)' },
})
export class Spotlight {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  protected move(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
