import { TestBed } from '@angular/core/testing';
import { TourDeTaille } from './tour-de-taille';

describe('TourDeTaille', () => {
  it("décrit le schéma en texte et nomme les deux repères et l'endroit où l'on mesure", () => {
    const fixture = TestBed.createComponent(TourDeTaille);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('figure')?.getAttribute('aria-label')).toContain('mi-distance');
    const texte = root.textContent ?? '';
    for (const mot of ['Dernières', 'Haut des hanches', 'On mesure ici', 'à mi-distance']) {
      expect(texte).toContain(mot);
    }
  });
});
