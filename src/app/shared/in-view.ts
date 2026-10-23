import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Ajoute la classe `inview` quand l'élément arrive à l'écran, une seule fois : les animations
 * décrites dans styles.css (`.inview .anim-…`) démarrent alors, même si le bloc était hors écran
 * au chargement. Sans observateur ou avec « moins de mouvement », la classe est posée tout de suite.
 */
@Directive({ selector: '[appInView]' })
export class InView {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (typeof IntersectionObserver === 'undefined') {
        node.classList.add('inview');
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          node.classList.add('inview');
          observer.disconnect();
        },
        { threshold: 0.2 },
      );
      observer.observe(node);
    });
  }
}
